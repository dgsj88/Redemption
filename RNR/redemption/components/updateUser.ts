export default function UserList({ onUserUpdated }) {
  const handleUpdate = async (user) => {
    const updatedUser = prompt('Update user', user.email);
    if (updatedUser === null) return;
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, email: updatedEmail }),
      });
      if (response.ok) {
        onUserUpdated();
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
}