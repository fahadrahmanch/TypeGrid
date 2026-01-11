import React from 'react';


const RecentPosts: React.FC = () => {
  const posts = [
    {
      title: 'I have a batter everyone😅',
      author: 'Boom',
      time: '1 week ago',
      content: 'So I was just typing on typer.io like I always do and some random dude comes into the match as my name...',
      comments: 5
    },
    {
      title: 'I have a batter everyone😅',
      author: 'Boom',
      time: '1 week ago',
      content: 'So I was just typing on typer.io like I always do and some random dude comes into the match as my name...',
      comments: 5
    },
    {
      title: 'I have a batter everyone😅',
      author: 'Boom',
      time: '1 week ago',
      content: 'So I was just typing on typer.io like I always do and some random dude comes into the match as my name...',
      comments: 5
    }
  ];

  return (
    <div className="h-full">
      <h2 className="text-xl font-bold mb-6 text-gray-900 font-serif pl-2">Recent Posts</h2>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={index} className="bg-[#FFF5E0] p-5 rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-orange-100">
            <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{post.title}</h3>
            <div className="text-[10px] text-gray-400 mb-3 font-medium">
              {post.time} by <span className="underline cursor-pointer text-gray-500 hover:text-gray-700">{post.author}</span>
            </div>
            <p className="text-xs font-serif italic text-gray-600 mb-4 line-clamp-3 leading-relaxed">
              {post.content}
            </p>
            <div className="flex flex-col gap-1">
                <div className="text-[10px] text-gray-400">
                    Last comment 14 hours ago
                </div>
                <div className="text-[10px] text-gray-500 font-bold underline flex items-center gap-1">
                    {post.comments} comments
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPosts;
