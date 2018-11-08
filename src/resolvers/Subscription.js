const Subscription = {
    comment: {
        subscribe(parent, { postId }, { pubsub, db }, info) {
            const post = db.posts.find(post => post.id === postId && post.published );
            if(!post) throw new Error('post not found');

            return pubsub.asyncIterator(`commentChannel for post ${postId}`);
        }
    },
    post: {
        subscribe(parent, args, { db, pubsub }, info){
            return pubsub.asyncIterator(`postChannel for all users`);
        }
    }
}

export default Subscription;