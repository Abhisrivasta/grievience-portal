import { useAuth } from "../contexts/AuthContext";
import MainLayout from "../components/layout/MainLayout";

function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <MainLayout>
        <p>Loading profile...</p>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <p>No profile data</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h2>My Profile</h2>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <p>
        <strong>Account Created:</strong>{" "}
        {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </MainLayout>
  );
}

export default Profile;
