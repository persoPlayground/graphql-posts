const User = {
    posts(parents, args, {db}, info){
        return db.posts.filter(post => post.author === parents.id);
    },
    comments(parent, args, {db}, info){
        return db.comments.filter(comment => comment.user === parent.id )
    }   
    };

    export default User;