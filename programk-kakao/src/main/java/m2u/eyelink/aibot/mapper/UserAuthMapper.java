package m2u.eyelink.aibot.mapper;

import m2u.eyelink.aibot.domain.UserAuth;

//@Repository(value = "userAuthMapper")
public interface UserAuthMapper {

    /**
     * 조회
     *
     * @param userAuth the userAuth
     * @return cp user
     */
    public UserAuth select(UserAuth userAuth);

    /**
     * 추가
     *
     * @param userAuth the userAuth
     * @return int
     */
    public int insert(UserAuth userAuth);

    /**
     * 삭제
     *
     * @param userAuth the userAuth
     * @return int
     */
    public int delete(UserAuth userAuth);

    /**
     * 수정
     *
     * @param userAuth the userAuth
     * @return int
     */
    public int update(UserAuth userAuth);
    
}
