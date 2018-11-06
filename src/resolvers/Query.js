const  Query = {
    me(){
        return {
            id: '984y32',
            name: 'Mo',
            email: 'me@example.com',
            age: 11
        }
    },
    post(){
        return {
            id:'03u20',
            title:'title',
            body:'body',
            published: true
        }
    },
    greeting(parent, args, {db}, info){
        return `hello ${args.name}`;
    },
    grades(parents, args, {db}, info){
        return [ 1,2,3,4]
    }, 
    add(parent, args, {db}, info){
        return args.numbers.length === 0 ? 0 : args.numbers.reduce((total, num) => total + num, 0);
    },
    users(parents, args, {db}, info){
        return !args.name ? db.users : db.users.filter(user => user.name.toLowerCase().includes(args.name.toLowerCase())); 
    },
    posts(parent, args, {db}, info){
        return !args.query? db.posts : db.posts.filter(post => post.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) || post.title.toLocaleLowerCase().includes(args.query.toLocaleLowerCase()) )
    },
    comments(parent, args, {db}, info){
        return db.comments;
    }
};

export default Query;