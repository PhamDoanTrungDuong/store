import {
      Navigate, useLocation,
} from "react-router";
import { toast } from "react-toastify";
import { useAppSelector } from "../store/configureStore";

interface IProps {
      children: JSX.Element;
      roles?: string[];
}

const PrivateRoute: React.FC<IProps> = ({ children, roles }) => {
      const {user} = useAppSelector(state => state.account);
      let location = useLocation();

      if (!user) {
            return <Navigate to="/login" state={{ from: location }} replace />;
      }
      if(roles && !roles?.some((r: any) => user.roles?.includes(r))){
            toast.error('Not authorised to access this area')
            return <Navigate to="/catalog" state={{ from: location }} replace />;
      }

      return children;
};

export default PrivateRoute;
