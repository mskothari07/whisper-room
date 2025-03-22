'use client';

const Navbar = () => {
  return (
    <nav className="bg-gray-900 p-4 text-neon-green flex justify-between items-center">
      <h1 className="text-2xl font-bold">Whisper Room</h1>
      <div>
        <a href="/" className="p-2 hover:text-purple-400">Home</a>
        <a href="#about" className="ml-4 p-2 hover:text-purple-400">About</a>
      </div>
    </nav>
  );
};

export default Navbar;
