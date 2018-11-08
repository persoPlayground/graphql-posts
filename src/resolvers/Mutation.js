import uuidv4 from 'uuid/v4';

const Mutation = {
    createUser(parent, args, {db}, info){
        const { data } = args;
        const emailTaken = db.users.some(user => user.email == data.email);
        if(emailTaken) throw new Error('Email exists');
        const newUser = {
            id: uuidv4(),
           ...data
        }
        db.users.push(newUser);
        return newUser;
    },

    deleteUser(parents, args, {db}, info){
        const userIndex = db.users.findIndex(user => user.id === args.id);
        if(userIndex === -1 ) throw new Error('no user found');
        const deletedUser =  db.users.splice(userIndex, 1);

        db.posts = db.posts.filter(post => post.author !== args.id );
        db.comments = db.comments.filter(comment => db.posts.some(post => post.id === comment.post && comment.user !== args.id));

        return deletedUser[0];
    },

    updateUser(parent, { id, data }, { db } , info){
        const user = db.users.find(user => user.id === id);
        if(!user ) throw new Error('no user found');

       if(typeof data.email === 'string') {
           const isEmailTaken = db.user.some(user => user.email === data.email );
           if(isEmailTaken) throw new Error('Email taken');
           user.email = data.email;
       }
       if(typeof data.name === 'string'){
           user.name = data.name;
       }
       if(typeof data.age !== 'undefined'){
           user.age = data.age
       }
    return user;
    },

    createPost(parent, args, {db, pubsub }, info){
        const { data } = args;
        const userExists = db.users.some(user => user.id === data.author);
        if(!userExists) throw new Error('user not found');
        const newPost = {
            id: uuidv4(),
           ...data
        };
        db.posts.push(newPost);
        if(data.published){
            pubsub.publish(`postChannel for all users`, {post: {
                mutation: 'CREATED',
                data: newPost
            } });
        }
        return newPost;
    },

    deletePost(arent, args, {db, pubsub}, info){
        const postIndex = db.posts.findIndex(post => post.id === args.id);
        if(postIndex === -1 ) throw new Error('post not found');
        const deletedPost = db.posts.splice(postIndex, 1);
        db.comments = db.comments.filter(comment => comment.post !== args.id);
        if(deletedPost[0].published){
            pubsub.publish(`postChannel for all users`, {post: {
                mutation: 'DELETED',
                data: deletedPost[0]
            }});
        }
        return deletedPost[0];
    },

    updatePost(parent,args, { id, data, pubsub }, info){
        const post = db.posts.find(post => post.id === id);

        if(!post ) throw new Error('no post found');
        const originalPost = {...post};

       if(typeof data.title === 'string') {
           post.title = data.title;
       }
       if(typeof data.body === 'string'){
           post.body = data.body;
       }
       if(typeof data.published === 'boolean'){
           post.published = data.published
       }
//subscription
if(originalPost.published && !post.published){
    pubsub.publish(`postChannel for all users`, {post: {
        mutation: 'DELETED',
        data: originalPost
    }});
} else if(!originalPost.published && post.published){
    pubsub.publish(`postChannel for all users`, {post: {
        mutation: 'CREATED',
        data: post
    } });
} else if(post.published){
    pubsub.publish(`postChannel for all users`, {post: {
        mutation: 'UPDATED',
        data: post
    } });
}
    return post;

    },

    createComment(parent, args, {db, pubsub}, info){
        const { data } = args;
        const userExists = db.users.some(user => user.id === data.user );
        const postExists = db.posts.filter(post => post.published).some(post => post.id === data.post );
        if(!userExists || !postExists) throw new Error('comment error');
        
        const newComment = {
            id: uuidv4(),
           ...data
        }
        db.comments.push(newComment);
        //subscription
        pubsub.publish(`commentChannel for post ${data.post}`, {comment: {
            mutation: 'CREATED',
            data: newComment
        }});
        return newComment;
    },

    deleteComment(parent, args, {db, pubsub}, info){
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id) ;
        if(commentIndex === -1 ) throw new Error('comment not found');

        const deletedComment = db.comments.splice(commentIndex, 1);
        pubsub.publish(`commentChannel for post ${data.post}`, {comment: {
            mutation: 'DELETED',
            data: deletedComment[0]
        }});
        return deletedComment[0];

    },
    updateComment(parent,args, { id, data, pubsub }, info){
        const comment = db.comments.find(comment => comment.id === id);
        if(!comment ) throw new Error('no comment found');

       if(typeof data.text === 'string') {
           comment.text = data.text;
       }
       pubsub.publish(`commentChannel for post ${data.post}`, {comment: {
        mutation: 'UPDATED',
        data: comment
    }});
       
    return comment;

    }
};

export default Mutation;