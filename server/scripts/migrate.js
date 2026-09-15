require('dotenv').config();
const mongoose = require('mongoose');
(async () => {
 // Run during maintenance with all application writers stopped and after a backup.
 mongoose.set('autoIndex', false);
 await require('../config/db')();
 const Queue = require('../models/Queue');
 const Barber = require('../models/Barber');
 const User = require('../models/User');
 const duplicates = async (match, id) => Queue.aggregate([{ $match: match }, { $group: { _id: id, count: { $sum: 1 } } }, { $match: { count: { $gt: 1 } } }, { $count: 'groups' }]);
 const checks = [await duplicates({}, {barber:'$barber',token:'$tokenNumber'}), await duplicates({status:'SERVING'}, '$barber'), await duplicates({status:{$in:['WAITING','SERVING']}}, '$phone')];
 if (checks.some(x=>x.length)) throw new Error('Duplicate tokens, active phones or serving entries found. Resolve them before migration; no records were modified.');
 for (const q of await Queue.find().select('barber')) if (!await Barber.exists({_id:q.barber})) throw new Error('Orphan queue found. Repair references before migration.');
 for (const b of await Barber.find()) if (!await User.exists({_id:b.user,role:'BARBER'})) throw new Error('Orphan or mismatched barber account found. Repair before migration.');
 await Queue.updateMany({status:{$nin:['WAITING','SERVING']}},{$unset:{activePhone:''}});
 for (const q of await Queue.find({status:{$in:['WAITING','SERVING']}})) await Queue.updateOne({_id:q._id},{$set:{activePhone:q.phone}});
 const indexes = await Queue.collection.indexes().catch(error=>{if(error.code===26)return [];throw error;});
 const old = indexes.find(i=>i.name==='barber_1_tokenNumber_1' && !i.unique);
 if(old) await Queue.collection.dropIndex(old.name);
 await Queue.createIndexes(); await Barber.createIndexes(); await User.createIndexes();
 console.info('Migration complete. Legacy numeric customer links are retired; staff can still manage existing entries.');
})().catch(error=>{console.error(error.message);process.exitCode=1;}).finally(()=>mongoose.disconnect());
