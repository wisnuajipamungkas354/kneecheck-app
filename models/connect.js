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

  /**
   * Query Get & Filter Data
   * 
   * 
   */
  select(col = '*') {
    this.query = 'SELECT ' + col + ' FROM ' + this.tableName;
    return this;
  }
  where(col, opr = '=', value) {
    this.query = this.query + ' WHERE ' + col + ' ' + opr + ' ' + value;
    return this;
  }
  get() {
    return this.query;
  }
  first() {
    this.query = this.query + ' LIMIT 1';
    return this.query;
  }

  create(values) {
    this.query = `INSERT INTO ${this.tableName} VALUES (${values})`;
    return this.query;
  }

}

export default Model;