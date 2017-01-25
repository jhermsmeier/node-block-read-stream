var fs = require( 'fs' )
var inherits = require( 'util' ).inherits
var Stream = require( 'stream' )

/**
 * BlockReadStream
 * @param {Object} options
 * @param {String} options.path
 * @param {String} options.flags
 * @param {Number} options.blockSize
 * @return {BlockReadStream}
 */
function BlockReadStream( options ) {

  if( !(this instanceof BlockReadStream) )
    return new BlockReadStream( options={} )

  Stream.Readable.call( this, options )

  this.fd = null
  this.blockSize = options.blockSize || ( 256 * 1024 )
  this.path = options.path
  this.flags = options.flags || 'r'

  this._handleRead = this._handleRead.bind( this )

}

inherits( BlockReadStream, Stream.Readable )

Object.assign( BlockReadStream.prototype, {

  _onError( error ) {
    this.destroy()
    this.emit( 'error', error )
  },

  _open( callback ) {
    fs.open( this.path, this.flags, ( error, fd ) => {
      this.fd = fd
      this.bytesRead = 0
      if( error ) return this._onError( error )
      fs.stat( this.path, ( error, stats ) => {
        if( error ) return this._onError( error )
        this.bytesLeft = stats.size
        if( callback ) callback.call( this )
      })
    })
  },

  _handleRead( error, bytesRead, buffer ) {
    if( error ) return this._onError( error )
    this.bytesRead += bytesRead
    this.bytesLeft -= bytesRead
    if( this.push( buffer ) ) {
      this._readBlock()
    }
  },

  _readBlock() {

    var size = Math.min( this.bytesLeft, this.blockSize )
    if( size <= 0 ) return this.close();

    fs.read( this.fd, Buffer.allocUnsafe( size ), 0, size, null, this._handleRead )

  },

  _read( size ) {
    // TODO: Adjust blocksize by reads?
    // this.blockSize = size
    if( this.fd ) this._readBlock()
    else this._open( this._readBlock )
  },

  close( callback ) {
    fs.close( this.fd, ( error ) => {
      this.fd = null
      this.push( null )
      callback && callback.call( this, error )
    })
  },

  destroy() {
    fs.close( this.fd, ( error ) => {
      this.fd = null
      Stream.Readable.prototype.destroy.call( this )
    })
  },

})

module.exports = BlockReadStream
