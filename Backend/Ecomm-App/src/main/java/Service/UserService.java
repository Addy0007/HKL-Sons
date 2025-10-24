package Service;


import Model.User;
import org.springframework.stereotype.Service;
import Exception.UserException;

@Service
public interface UserService {

    public User findUserById(Long userId) throws UserException;
    public User findUserProfileByJwt(String jwt) throws UserException;

}
