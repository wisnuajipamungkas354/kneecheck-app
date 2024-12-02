import mysql from "mysql2";

class Model {
  // private variable
  #query;
  #select;
  #where = "";
  #orderBy = "";

  constructor(tableName) {
    this.tableName = tableName;
  }

  /**
   * Select Clause
   * @return SELECT columns FROM tableName
   * @param string Must be string, separate comma (,) if the column least of one
   * @return Object Model
   */
  select(col = "*") {
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
  where(col, opr = "=", value) {
    this.#where = `WHERE ${col} ${opr} ${
      typeof value === "number" ? value : '"' + value + '"'
    }`;
    return this;
  }

  /**
   * Order By Clause
   * @param {*} col Name of the column (string)
   * @param {*} urutan Ascending / Descending
   * @return Object Model
   */
  orderBy(col = "", urutan = "ASC") {
    this.#orderBy = `ORDER BY ${col} ${urutan}`;
    return this;
  }

  /**
   * Query Get Data
   */
  get() {
    if (this.#select === undefined) {
      this.#select = `SELECT * FROM ${this.tableName}`;
    }

    this.#query = `${this.#select} ${this.#where} ${this.#orderBy}`;
    return this.#connect(this.#query);
  }

  first() {
    if (this.#select === undefined) {
      this.#select = `SELECT * FROM ${this.tableName}`;
    }

    this.#query = `${this.#select} ${this.#where} LIMIT 1`;
    return this.#connect(this.#query);
  }

  count(col = "*", alias = 'total') {
    this.#query = `SELECT COUNT (${col}) AS ${alias} FROM ${this.tableName} ${
      this.#where
    } ${this.#orderBy}`;
    return this.#connect(this.#query);
  }
  /**
   * Where Data is Exists
   * @returns SELECT EXISTS (SELECT col FROM tableName WHERE CLAUSE) : 1
   * @method where() Must call method where() first
   */
  async exists() {
    if (this.#select === undefined) {
      this.#query = `SELECT EXISTS (SELECT * FROM ${this.tableName} ${
        this.#where
      }) AS result`;
    } else {
      this.#query = `SELECT EXISTS (${this.#select} ${this.#where}) AS result`;
    }
    const result = await this.#connect(this.#query);
    return result[0].result;
  }

  /**
   * Get value string of rows
   * @param string Parameter Must be String
   * @returns String Value
   */
  async value(col) {
    try {
      if (typeof col === "string") {
        this.#query = `SELECT ${col} AS result FROM ${this.tableName} ${
          this.#where
        } LIMIT 1`;
        const result = await this.#connect(this.#query);
        return result[0].result;
      } else {
        throw new Error("Parameter must be string");
      }
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * Create Database
   * @return INSERT INTO tableName VALUES (values)
   * @param Any String, Number, NULL
   */
  create(...values) {
    values = values
      .map((value) => (typeof value === "number" ? value : `"${value}"`))
      .join(", ");
    this.#query = `INSERT INTO ${this.tableName} VALUES (${values})`;
    return this.#connect(this.#query);
  }

  /**
   * Update Database
   * @param {*} obj
   * @return UPDATE tableName SET key = value WHERE CLAUSE
   */
  update(obj) {
    const cols = Object.keys(obj);
    const values = Object.values(obj);
    const updateData = cols
      .map(
        (col, i) =>
          `${col} = ${
            typeof values[i] === "number" ? values[i] : `"${values[i]}"`
          }`
      )
      .join(", ");

    this.#query = `UPDATE ${this.tableName} SET ${updateData} ${this.#where}`;
    return this.#connect(this.#query);
  }

  /**
   * Delete Database
   * @return DELETE FROM tableName WHERE CLAUSE
   * @method where() Must call method where() first;
   */
  destroy() {
    try {
      if (this.#where === undefined) {
        throw new Error("Error: WHERE CLAUSE UNDEFINED");
      } else {
        this.#query = `DELETE FROM ${this.tableName} ${this.#where}`;
        return this.#connect(this.#query);
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Custom Query
   * @returns YOUR CUSTOM QUERY
   * @param query string
   */

  customQuery(query) {
    try {
      if (!query) {
        throw new Error("Masukkan sintaks query");
      }

      if (typeof query === "string") {
        return this.#connect(query);
      } else {
        throw new Error("Sintaks query harus berupa string!");
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  /**
   * Connection to Database
   * @return mysql.createConnection
   */
  async #connect(sql) {
    const connection = mysql.createConnection({
      host: "34.128.85.66",
      user: "root",
      database: "knee_db",
      password: "knee123",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    try {
      const [rows, fields] = await connection.promise().query(sql);
      return rows;
    } catch (err) {
      return err;
    } finally {
      connection.end();
    }
  }
}

export default Model;
