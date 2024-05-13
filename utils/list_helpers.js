const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs)=>{
    const total = blogs.reduce((acum, current)=> acum + current.likes, 0);
    return total;
}

const favouriteBlog = (blogs)=>{
    let mostLikes = 0;
    let mostLikedBlog = {};

    blogs.forEach((blog)=>{
        
        if(blog.likes > mostLikes){
            mostLikedBlog = blog;
            mostLikes = blog.likes;            
        }
    });

    return mostLikedBlog;
} 

const mostBlogs = (blogs)=>{
    
    let authorsLikesCount = {}

    blogs.forEach((blogPost)=>{
        authorsLikesCount[blogPost.author] = (authorsLikesCount[blogPost.author] || 0) + 1;
    })

    let maxLikes = 0;
    let authorWithMoreLikes = "";

    for (const autor in authorsLikesCount){
        if (authorsLikesCount[autor] > maxLikes){
            maxLikes = authorsLikesCount[autor];
            authorWithMoreLikes = autor;
        }
    }

    return {author: authorWithMoreLikes, posts: maxLikes};
   
}

const mostLikes = (blogs)=>{

    let authorsLikesCount = {}

    blogs.forEach((blogPost)=>{
        authorsLikesCount[blogPost.author] = (authorsLikesCount[blogPost.author] || 0) + blogPost.likes;
    });

    let maxLikes = 0;
    let authorWithMoreLikes = "";

    for (const autor in authorsLikesCount){
        if (authorsLikesCount[autor] > maxLikes){
            maxLikes = authorsLikesCount[autor];
            authorWithMoreLikes = autor;
        }
    }

    return {author: authorWithMoreLikes, likes: maxLikes};
}
module.exports = { dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes };
