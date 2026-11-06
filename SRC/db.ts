import Dexie, { type Table } from 'dexie';
export type User={id?:number;name:string;pinHash?:string;createdAt:string};
export type Category={id?:number;name:string;kind:'expense'|'fuel'|'electricity';color:string};
export type Expense={id?:number;date:string;categoryId?:number;categoryName:string;amount:number;note:string;userId?:number;createdAt:string};
export type Vehicle={id?:number;name:string;plate:string;fuelType:string};
export type Fuel={id?:number;vehicleId:number;date:string;odometer:number;liters:number;price:number;fullTank:boolean;note:string;userId?:number};
export type ElecAccount={id?:number;name:string;meterNumber:string;mode:'remaining'|'cumulative';};
export type Token={id?:number;accountId:number;date:string;amount:number;kwh:number;fee:number;note:string;userId?:number};
export type Reading={id?:number;accountId:number;date:string;value:number;userId?:number};
export type Backup={id?:number;date:string;json:string;kind:'auto'|'manual'};
class MyExpenseDB extends Dexie {
 users!:Table<User>; categories!:Table<Category>; expenses!:Table<Expense>;
 vehicles!:Table<Vehicle>; fuels!:Table<Fuel>; accounts!:Table<ElecAccount>;
 tokens!:Table<Token>; readings!:Table<Reading>; backups!:Table<Backup>;
 constructor(){super('MyExpenseDB');this.version(1).stores({
 users:'++id,name',categories:'++id,kind,name',expenses:'++id,date,categoryId,userId',
 vehicles:'++id,name,plate',fuels:'++id,vehicleId,date,userId',accounts:'++id,name',
 tokens:'++id,accountId,date,userId',readings:'++id,accountId,date,userId',backups:'++id,date,kind'
 });}
}
export const db=new MyExpenseDB();
export async function seed(){
 if(await db.categories.count()===0) await db.categories.bulkAdd([
 {name:'Makanan',kind:'expense',color:'#e9a23b'},{name:'Belanja',kind:'expense',color:'#4b9b83'},
 {name:'Transportasi',kind:'expense',color:'#6387c9'},{name:'Kesehatan',kind:'expense',color:'#c87991'},
 {name:'Lain-lain',kind:'expense',color:'#8d7bb5'}]);
}
export async function snapshot(kind:'auto'|'manual'='auto'){
 const data={version:1,createdAt:new Date().toISOString(),
 users:await db.users.toArray(),categories:await db.categories.toArray(),
 expenses:await db.expenses.toArray(),vehicles:await db.vehicles.toArray(),
 fuels:await db.fuels.toArray(),accounts:await db.accounts.toArray(),
 tokens:await db.tokens.toArray(),readings:await db.readings.toArray()};
 await db.backups.add({date:data.createdAt,json:JSON.stringify(data),kind});
 if(kind==='auto'){const all=await db.backups.orderBy('date').toArray();if(all.length>10)await db.backups.bulkDelete(all.slice(0,all.length-10).map(x=>x.id!));}
 return data;
}
export async function restore(data:any){
 if(data?.version!==1) throw new Error('Format backup tidak dikenal.');
 await db.transaction('rw',[db.users,db.categories,db.expenses,db.vehicles,db.fuels,db.accounts,db.tokens,db.readings],async()=>{
  for(const [key,table] of [['users',db.users],['categories',db.categories],['expenses',db.expenses],['vehicles',db.vehicles],['fuels',db.fuels],['accounts',db.accounts],['tokens',db.tokens],['readings',db.readings]] as const){
   if(!Array.isArray(data[key])) throw new Error('Data '+key+' tidak valid.');
   await table.clear(); await table.bulkAdd(data[key]);
  }
 });
}
