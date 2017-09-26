-- 사용자 인증을 위한 테이블 생성
CREATE TABLE user_auth
(
	user_key character varying(32) NOT NULL,	-- 카카오톡 사용자 키
	last_auth_dttm character varying(20),	-- 마지막 인증 일시
	last_talk_dttm character varying(20),	-- 마지막 대화 일시
	CONSTRAINT auth_user_pkey PRIMARY KEY (user_key)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE user_auth
  OWNER TO talksearch;
COMMENT ON TABLE user_auth IS '';
COMMENT ON COLUMN user_auth.user_key IS '카카오톡 사용자키';
COMMENT ON COLUMN user_auth.last_auth_dttm IS '마지막 인증 일시';
COMMENT ON COLUMN user_auth.last_talk_dttm IS '마지막 대화 일시';