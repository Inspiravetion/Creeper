var fs          = require('fs'),
	colors      = require('colors'),
	Interpreter = require('../src/Interpreter.js').constr,
	Bookie      = require('../src/Bookie.js').constr;

describe('watch()', function(){
	var file, cmdFile, bookie, stat;
	beforeEach(function(){
		stat = {
			//need to test when this is false too!!!
			isFile : function(){return true;}
		};
		spyOn(fs, 'statSync').andCallFake(function(){return stat});
		spyOn(fs, 'readFileSync').andCallFake(function(){});
		spyOn(Interpreter.prototype, 'interpret').andCallFake(function(){
			return {'horribly' : 'mocked commands'};
		});
		spyOn(fs, 'watch').andCallFake(function(){
			return {'watcher': 'object'};
		});
		bookie  = new Bookie();
		file    = 'file';
		cmdFile = 'cmdFile';
		bookie.watch(file, cmdFile);
	});

	it('stores the correct FSWatcher for the given file in the registry', function(){
		expect(bookie.registry_.file.watcher).toEqual({'watcher': 'object'});
	});

	it('calles fs.watch() to start monitoring the file', function(){
		expect(fs.watch).toHaveBeenCalled();
	});

	it('stores the correct cmdFile for the given file in the registry', function(){
		expect(bookie.registry_.file.commandFile).toBe('cmdFile');
	});

	it('reads the contents of the given command file before passing them to the Interpreter', function(){
		expect(fs.readFileSync).toHaveBeenCalled();
	});
});

describe('unWatch()', function(){
	var watcher, registryEntry, filename, bookie;
	beforeEach(function(){
	    watcher       = {
			close : function(){}
		},
	    registryEntry = {'commandFile' : 'file', 'watcher' : watcher},
		filename      = 'filename',
		bookie        = new Bookie();
		bookie.registry_[filename] = registryEntry;
	});

	it('deletes the file information out of the registry', function(){
		bookie.unWatch(filename);
		expect(bookie.registry_).toEqual({});
	});

	it('calls close() on the associated FSWatcher', function(){
		spyOn(watcher, 'close');
		bookie.unWatch(filename);
		expect(watcher.close).toHaveBeenCalled();
	});

	it('returns true if filename was registered', function(){
		expect(bookie.unWatch(filename)).toBe(true);
	});

	it('returns false if filename is not registered', function(){
		bookie.registry_ = {};
		expect(bookie.unWatch(filename)).toBe(false);
	});
});

describe('getMapping()', function(){
	it('returns the right string representation of the file --> commandFile mapping', function(){
		var file1, file2, entry1, entry2, bookie;
		file1  = 'file1';
		file2  = 'file2';
		entry1 = {'commandFile' : 'cmdFile1', 'watcher' : {}};
		entry2 = {'commandFile' : 'cmdFile2', 'watcher' : {}};
		bookie = new Bookie(),
		compString = '\n\nFiles Currently Being Creeped On:\n';

		bookie.registry_[file1] = entry1;
		bookie.registry_[file2] = entry2;

		compString += '-------------------------------------------------------\n';
		compString += '\n1. File: ' + 'file1'.cyan + '  ==>  CommandFile: ' + 'cmdFile1'.cyan;
		compString += '\n2. File: ' + 'file2'.cyan + '  ==>  CommandFile: ' + 'cmdFile2'.cyan;
		expect(bookie.getMapping()).toEqual(compString);
	});
});















