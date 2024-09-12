
let conn = {
    query: (query: string) =>  [[{name: 'John Doe', age: 25}]],
    end: async () => {
        console.log('Closing the connection');
    }
};


console.log("Before calling query", conn.query('SELECT * FROM users'));