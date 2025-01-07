import { CreateUser } from "./create-user";
import { useGetUsers } from "./http/generated/users/users";

function App() {
  const { data: users } = useGetUsers();

  return (
    <div>
      <ul>
        {users?.data.map((user) => {
          return <li key={user.id}>{user.name}</li>;
        })}
      </ul>

      <CreateUser />
    </div>
  );
}

export default App;
