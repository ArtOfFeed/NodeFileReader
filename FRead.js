const fs = require('fs');
const path = require('path');
const directoryPath = path.join(__dirname, 'test');

fs.readdir(directoryPath, (err, files) => {
	if (err) {
		throw err;
	}
	files.forEach(function (file) {
		var fileName = file.split('.')[0]
		currentRead('./test/' + file, fileName);
	});
});

function currentRead(file, fileName) {
	fs.readFile(file, (err, data) => {
		if(err) {
			throw err;
		}

		var array = data.toString().split('\n');
		var obj = {
			fileName: []
		};
		for(i in array) {
			obj.fileName.push(array[i]);
		}
		var json = JSON.stringify(obj, null, '  ').replace(/[\\n\\r]/g, '');
		currentWrite(json);
	});
}

function currentWrite(data) {
	fs.writeFile('test.json', data, 'utf8', (err) => {
		if (err) {
			throw err;
		}
	})
}