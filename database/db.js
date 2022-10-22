const fs = require("node:fs");

module.exports = class{
	constructor(){
		this.key = "./database/keys/";
	}
	
	get(key,options){
		return new Promise((res,rej) => {
			if(!fs.existsSync(this.key + key)) return res(null);
			let content = fs.readFileSync(this.key + key).toString();
			
			if(options && options.raw){
				res(content);
			} else{
				let value;

				try{
					value = JSON.parse(content);
				} catch(err){
					value = content;
				}

				if(value === null || value === undefined){
					res(value);
				}

				res(value);
			}
		});
	}

	set(key,value){
		return new Promise((res,rej) => {
			try{
				fs.writeFileSync(this.key + key,value);
			} catch(e){
				rej(e);
			}
		});
	}

	delete(key){
		return new Promise((res,rej) => {
			if(!fs.existsSync(this.key + key)) return;
			try{
				fs.unlinkSync(this.key + key);
			} catch(e){
				rej(e);
			}
		});
	}
}