import mysql from 'mysql';



class Model {
  connection = mysql.createConnection({
    host: '34.127.21.55',
    user: 'root',
    database: 'knee_db',
    password: 'knee123'
  });
  query = '';
  
  constructor(tableName) {
    this.tableName = tableName;
  }
  select(col = '*') {
    this.query = 'SELECT ' + col + ' FROM ' + this.tableName;
    return this;
  }
  where(col, opr = '=', value) {
    this.query = this.query + ' WHERE ' + col + ' ' + opr + ' ' + value;
    return this;
  }
  get() {
    this.connection.query(this.query, (err, rows) => {
      if(err){
        return 'Gagal';
      }else{
        return rows;
      }
    })
  }
}

export default Model;