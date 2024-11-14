import mysql from 'mysql';

class Model {
  query;
  
  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Query Filter Data
   */
  select(col = '*') {
    this.query = 'SELECT ' + col + ' FROM ' + this.tableName;
    return this;
  }
  where(col, opr = '=', value) {
    this.query === undefined ? 
    this.query = `WHERE ${col} ${opr} ${value}` :
    this.query = this.query + ` WHERE ${col} ${opr} ${value}`;
    return this;
  }
  orderBy(col, urutan = 'ASC') {
    col === undefined ?
    this.query = this.query + ` ${urutan}` : 
    this.query = this.query + ` ORDER BY ${col} ${urutan}`;
  }

  /**
   * Query Get Data
   */
  get() {
    return this.query;
  }
  first() {
    try {
      if(this.query === undefined) {
        throw new Error('Error: SELECT FROM UNDEFINED');
      } else {
        this.query = this.query + ' LIMIT 1';
        return this.query;
      }
    } catch(err) {
      console.log(err);
    }
  }
  count(col = '*') {
    try {
      if(this.query === undefined) {
        throw new Error('Error: WHERE CLAUSE UNDEFINED');
      } else {
        this.query = `SELECT COUNT (${col}) FROM ${this.tableName} ${this.query}`;
        return this.query;
      }
    } catch(err) {
      console.log(err);
    }
    
  }

  /**
   *Create, Update, Delete
   */
  create(values) {
    this.query = `INSERT INTO ${this.tableName} VALUES (${values})`;
    return this.query;
  }
  destroy() {
    try {
      if(this.query === undefined) {
        throw new Error('Error: WHERE CLAUSE UNDEFINED');
      } else {
        this.query = `DELETE FROM ${this.tableName} ${this.query}`;
        return this.query;
      }

    } catch(err) {
      console.log(err);
    }
  }
}

export default Model;