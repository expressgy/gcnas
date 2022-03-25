importScripts('./spark-md5.min.js');

self.postMessage({
    type:'message',
    data:'spark-md5加载完成！'
});

self.onmessage = async e => {
    if(e.data.type == 'file'){
        const fileList = e.data.data;
        for(let i in fileList){
            const t = new Date().getTime()
            const md5 = await makemd5(fileList[i])
            console.log(fileList[i].name,'耗时',new Date().getTime() - t)
            self.postMessage({
                type:'md5',
                md5,
                fileName:fileList[i].name,
                fileIndex:i
            })
        }
    }
}

function makemd5(file) {
    return new Promise((resolve, reject) => {
        const chunkSize = 4194304
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        let chunks = Math.ceil(file.size / chunkSize);
        let currentChunk = 0;
        let spark = new SparkMD5.ArrayBuffer();
        let fileReader = new FileReader();

        fileReader.onload = function(e) {
            spark.append(e.target.result);
            currentChunk++;
            if (currentChunk < chunks) {
                loadNext();
            } else {
                let md5 = spark.end();
                console.log(md5)
                resolve(md5);
            }
        };

        fileReader.onerror = function(e) {
            reject(e);
        };

        function loadNext() {
            let start = currentChunk * chunkSize;
            let end = start + chunkSize;
            if (end > file.size){
                end = file.size;
            }
            try{
                fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
            }catch (e){
                console.log(e)
            }

        }
        loadNext();
    });
}