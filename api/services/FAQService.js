
module.exports = {
	create : async(name) => {
		for(var i=0;i<name.length;i++){
			if(name[i] != ""){
				var createTypeData = await db.FAQType.create({
					name: name[i]
				});
			}
		}
	},

	update : async(FAQType,FAQTypeId) => {
		for(var i=0;i<FAQTypeId.length;i++){
			var updateFAQType = await db.FAQType.findById(FAQTypeId[i]);
			if(FAQType[i]!=""){
				updateFAQType.name = FAQType[i];
				var update = updateFAQType.save();
			}
		}
	}
};