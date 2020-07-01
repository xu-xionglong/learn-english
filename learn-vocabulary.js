if (process.argv.length < 2) {
	return;
}


const fs = require('fs')
const readline = require('readline')

const filePath = process.argv[2];
const file = fs.readFileSync(filePath, 'utf8');
const lines = file.split('\n');
let words = [];
lines.forEach((line) => {
	try {
		words.push(JSON.parse(line));
	}
	catch (err) {

	}
})

let jIndex = 0;
let iIndex = 0;
let command = "";

function displayWord() {
	process.stdout.write('\033c');
	process.stdout.write((iIndex + 1) + '\n\n');
	const word = words[iIndex].content.word;
	
	let syno = word.content.syno;
	if (syno === undefined && word.content.realExamSentence !== undefined) {
		syno = word.content.realExamSentence.syno;
	}
	if (syno === undefined) {
		word.content.trans.forEach((tran) => {
			process.stdout.write(tran.pos + '. ' + tran.tranCn + '\n');
		})
	}
	else {
		syno.synos.forEach((syno) => {
			process.stdout.write(syno.pos + '. ' + syno.tran + '\n');
		})
	}

	process.stdout.write('\n');
	word.content.sentence.sentences.forEach((sentence, i) => {
		process.stdout.write((i + 1) + '. ' + sentence.sCn + '\n');
	})

	if (jIndex > 0) {
		process.stdout.write('\n' + word.wordHead + '\n');
	}
	let sentences = word.content.sentence.sentences;
	for (let j = 0; j < jIndex - 1; ++ j) {
		process.stdout.write('\n' + (j + 1) + '. ' + sentences[j].sContent);
	}
	process.stdout.write('\n');
}

displayWord();

let stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');
stdin.on('data', function(key){
	if (key === '\u001B\u005B\u0041') {
		//up
		if (jIndex === 0) {
			return;
		}
		-- jIndex;
	}
	else if (key === '\u001B\u005B\u0042'){
		//down
		if (jIndex === words[iIndex].content.word.content.sentence.sentences.length + 1) {
			return;
		}
		++ jIndex;
	}
    else if (key == '\u001B\u005B\u0044') {
    	//left
		iIndex = iIndex === 0 ? iIndex : iIndex - 1;
		jIndex = 0;
    }
    else if (key === '\u001B\u005B\u0043') {
    	//right
    	iIndex = iIndex === words.length - 1 ? iIndex : iIndex + 1;
		jIndex = 0;
    }
    else if (key === '\u0003') {
    	//ctrl-c
    	process.exit();
    }    
    else {
    	if (key === '\u000d') {
    		let i = parseInt(command);
    		if (i >= 0 && i < words.length) {
    			iIndex = i - 1;
    			displayWord();
    		}

    		process.stdout.clearLine();
    		process.stdout.cursorTo(0);
    		command = '';
    	}
    	else if (key === '\u007f') {
    		if (command.length > 0) {
    			command = command.substr(0, command.length - 1);
	    		process.stdout.clearLine();
	    		process.stdout.cursorTo(0);
	    		process.stdout.write(command);
    		}
    	}
    	else {
    		process.stdout.write(key);
    		command = command + key;
    	}
    	return;
    }
    displayWord();
});