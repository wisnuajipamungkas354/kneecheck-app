import mysql from 'mysql';

class Model {
  // private variable
  #query;
  #select;
  #where = '';
  #orderBy ='';

  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Select Clause
   * @return SELECT columns FROM tableName
   * @param string Must be string, separate comma (,) if the column least of one
   * @return Object Model
   */
  select(col = '*') {
    this.#select = `SELECT ${col} FROM ${this.tableName}`;
    return this;
  }

  /**
   * Where Clause
   * @param {*} col Name of the column (string)
   * @param {*} opr Operator (=, <, >, <=, >=, LIKE)
   * @param {*} value the column's value
   * @return Object Model
   */
  where(col, opr = '=', value) {
    this.#where = `WHERE ${col} ${opr} ${typeof value === 'number' ? value : '"' + value + '"'}`;
    return this;
  }

  /**
   * Order By Clause
   * @param {*} col Name of the column (string)
   * @param {*} urutan Ascending / Descending
   * @return Object Model
   */
  orderBy(col = '', urutan = 'ASC') {
    this.#orderBy = `ORDER BY ${col} ${urutan}`;
    return this;
  }

  /**
   * Query Get Data
   */
  get() {
    if(this.#select === undefined) {
      this.#select = `SELECT * FROM ${this.tableName}`;
    }
    
    this.#query = `${this.#select} ${this.#where} ${this.#orderBy}`;
    return this.#query;
  }
  first() {
    if(this.#select === undefined) {
      this.#select = `SELECT * FROM ${this.tableName}`;
    } 

    this.#query = this.#select + ' LIMIT 1';
    return this.#query;
  }
  count(col = '*') {
    this.#query = `SELECT COUNT (${col}) FROM ${this.tableName} ${this.#where} ${this.#orderBy}`;
    return this.#query;
  }

  /**
   * Create Database
   * @return INSERT INTO tableName VALUES (values)
   * @param Any String, Number, NULL
   */
  create(...values) {
    this.#query = `INSERT INTO ${this.tableName} VALUES (${values})`;
    return this.#query;
  }

  /**
   * Update Database
   * @param {*} obj 
   * @return UPDATE tableName SET key = value WHERE CLAUSE
   */
  update(obj) {
    const cols = Object.keys(obj);
    const values = Object.values(obj);
    const updateData = cols.map((col, i) => `${col} = ${typeof values[i] === 'number' ? values[i] : `"${values[i]}"`}`).join(', ');
    this.#query = `UPDATE ${this.tableName} SET ${updateData} ${this.#where}`;

    return this.#query;
  }

  /**
   * Delete Database
   * @return DELETE FROM tableName WHERE CLAUSE
   * @method where() Must call method where() first;
   */
  destroy() {
    try {
      if(this.#where === undefined) {
        throw new Error('Error: WHERE CLAUSE UNDEFINED');
      } else {
        this.#query = `DELETE FROM ${this.tableName} ${this.#where}`;
        return this.#query;
      }
    } catch(err) {
      console.log(err);
    }
  }

  /**
   * Connection to Database
   * @return mysql.createConnection
   */
  connect() {
    return mysql.createConnection({
      host: '34.127.21.55',
      user: 'root',
      database: 'knee_db',
      password: 'knee123'
    });
  }
}

export default Model;