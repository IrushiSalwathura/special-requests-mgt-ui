export default function Header({name, role}){
  const handleLogout = () => {
    localStorage.clear();
  };
  return (
  <>
  <header className="bg-stone-300 text-gray-700 p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">Hello {name}</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/dashboard" className="hover:text-gray-400">Dashboard</a></li>
          {role!='ADMIN' &&  <li><a href="/request" className="hover:text-gray-400">Create Request</a></li>}
          <li><a href="/login" onClick={handleLogout} className="hover:text-gray-400">Logout</a></li>
        </ul>
      </nav>
    </div>
  </header>
  </>);
}