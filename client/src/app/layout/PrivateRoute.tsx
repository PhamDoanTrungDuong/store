import {
      Navigate, useLocation,
} from "react-router";
import { useAppSelector } from "../store/configureStore";

interface IProps {
      children: JSX.Element;
}

const PrivateRoute: React.FC<IProps> = ({ children }: { children: JSX.Element }) => {
      const {user} = useAppSelector(state => state.account);
      let location = useLocation();

      if (!user) {
            // Redirect them to the /login page, but save the current location they were
            // trying to go to when they were redirected. This allows us to send them
            // along to that page after they login, which is a nicer user experience
            // than dropping them off on the home page.
            return <Navigate to="/login" state={{ from: location }} replace />;
      }

      return children;
};

export default PrivateRoute;
