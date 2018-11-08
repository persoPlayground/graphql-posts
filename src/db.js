const users = [{
    id: '1',
    name: 'Mo',
    email: 'me@example.com',
    age: 11,
    comments: ['11']

},
{
    id: '2',
    name: 'TO',
    email: 'to@example.com',
    age: 33

}];
const posts = [{
    id:'1',
    title:'title1',
    body:'body1',
    published: true,
    author: '1'
},
{
    id:'2',
    title:'title2',
    body:'body2',
    published: true,
    author: '1',
    comments: ['333']
},
{
    id:'3',
    title:'title3',
    body:'body3',
    published: false,
    author: '2'
}];
const comments = [{id:'333', text: 'fkje', user: '1', post: '2'}]

export default {
    users,
    posts,
    comments
}