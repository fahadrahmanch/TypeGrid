import ProfileDiv1 from "../../components/user/profile/ProfileDiv1";
import Navbar from "../../components/user/Navbar";
import { useParams } from "react-router-dom";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  return (
    <>
      <Navbar />
      <ProfileDiv1 userId={userId} />
    </>
  );
};
export default Profile;
