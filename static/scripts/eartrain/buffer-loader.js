function BufferLoader(context, keyList, callback) {
    this.context = context;
    this.keyList = keyList;
    this.onload = callback;
    this.bufferList = new Array(keyList.length);
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(dataArray, index) {
    // Asynchronously decode the audio file data
    var audioData = Base64Binary.decodeArrayBuffer(dataArray);
    var loader = this;
    loader.context.decodeAudioData(
        audioData,
        function(buffer) {
            if (!buffer) {
                console.log('error decoding file data: ' + audioData);
                return;
            }
            loader.bufferList[loader.keyList[index]] = buffer;
            if (++loader.loadCount == loader.keyList.length)
                loader.onload(loader.bufferList);
        },
        function(error) {
            console.error('decodeAudioData error', error);
        }
    );
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.keyList.length; ++i)
        this.loadBuffer(MIDI.Soundfont.acoustic_grand_piano[this.keyList[i]], i);
}
