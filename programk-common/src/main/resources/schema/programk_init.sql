-- programk DB셋팅 후 최초에 호출하는 Query

-- Table: aiml_category

-- DROP TABLE aiml_category;

CREATE TABLE aiml_category
(
  id integer NOT NULL, -- 대화 카테고리 고유번호
  cp_id integer NOT NULL, -- 검색서비스고유번호(관리자가 생성한 것은 0)
  name character varying(128) NOT NULL, -- 대화 카테고리 명
  created timestamp(6) without time zone NOT NULL, -- 생성일
  modified timestamp(6) without time zone NOT NULL, -- 수정일
  restriction character varying(7) NOT NULL DEFAULT 'owner'::character varying, -- 접근권한(all, owner)
  topic character varying(1) NOT NULL DEFAULT 'N'::character varying, -- 토픽여부(Y,N)
  topic_name character varying(128), -- 토픽 사용시 이름 재설정이 가능함
  enabled character varying(1) NOT NULL, -- 활성화여부(Y,N)
  upload_lock character varying(1), -- 엑셀 업로드시 삭제 불가(Y,N)
  CONSTRAINT aiml_category_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_category
  OWNER TO talksearch;
COMMENT ON TABLE aiml_category
  IS 'AIML 대화 카테고리';
COMMENT ON COLUMN aiml_category.id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_category.cp_id IS '검색서비스고유번호(관리자가 생성한 것은 0)';
COMMENT ON COLUMN aiml_category.name IS '대화 카테고리 명';
COMMENT ON COLUMN aiml_category.created IS '생성일';
COMMENT ON COLUMN aiml_category.modified IS '수정일';
COMMENT ON COLUMN aiml_category.restriction IS '접근권한(all, owner)';
COMMENT ON COLUMN aiml_category.topic IS '토픽여부(Y,N)';
COMMENT ON COLUMN aiml_category.topic_name IS '토픽 사용시 이름 재설정이 가능함';
COMMENT ON COLUMN aiml_category.enabled IS '활성화여부(Y,N)';
COMMENT ON COLUMN aiml_category.upload_lock IS '엑셀 업로드시 삭제 불가(Y,N)';

-- Table: aiml_images

-- DROP TABLE aiml_images;

CREATE TABLE aiml_images
(
  cate_id integer NOT NULL, -- 대화 카테고리 고유번호
  main_id integer NOT NULL, -- 대화 고유 번호
  id integer NOT NULL, -- 고유 번호
  url character varying(255) NOT NULL, -- 연결 URL
  alt character varying(255), -- 대체 텍스트
  CONSTRAINT aiml_images_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_images
  OWNER TO talksearch;
COMMENT ON TABLE aiml_images
  IS '이미지 링크 정보';
COMMENT ON COLUMN aiml_images.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_images.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_images.id IS '고유 번호';
COMMENT ON COLUMN aiml_images.url IS '연결 URL';
COMMENT ON COLUMN aiml_images.alt IS '대체 텍스트';


-- Index: index_aiml_images_on_main_id

-- DROP INDEX index_aiml_images_on_main_id;

CREATE INDEX index_aiml_images_on_main_id
  ON aiml_images
  USING btree
  (main_id);

-- Table: aiml_link

-- DROP TABLE aiml_link;

CREATE TABLE aiml_link
(
  id integer NOT NULL, -- 고유번호
  cate_id integer NOT NULL, -- 대화 카테고리 고유번호
  main_id integer NOT NULL, -- 대화 고유 번호
  title character varying(100) NOT NULL, -- 링크 제목
  comment character varying(255), -- 링크 설명
  url character varying(255) NOT NULL, -- 링크 URL
  CONSTRAINT aiml_link_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_link
  OWNER TO talksearch;
COMMENT ON TABLE aiml_link
  IS '링크 정보';
COMMENT ON COLUMN aiml_link.id IS '고유번호';
COMMENT ON COLUMN aiml_link.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_link.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_link.title IS '링크 제목';
COMMENT ON COLUMN aiml_link.comment IS '링크 설명';
COMMENT ON COLUMN aiml_link.url IS '링크 URL';


-- Index: index_aiml_link_on_main_id

-- DROP INDEX index_aiml_link_on_main_id;

CREATE INDEX index_aiml_link_on_main_id
  ON aiml_link
  USING btree
  (main_id);

-- Table: aiml_main

-- DROP TABLE aiml_main;

CREATE TABLE aiml_main
(
  cate_id integer NOT NULL, -- 대화 카테고리 고유번호
  id integer NOT NULL, -- 고유 번호
  input character varying(255) NOT NULL, -- 질문
  that_id integer NOT NULL, -- 이전 답변 번호
  reply text NOT NULL, -- 답변
  CONSTRAINT aiml_main_pkey PRIMARY KEY (cate_id, id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_main
  OWNER TO talksearch;
COMMENT ON TABLE aiml_main
  IS 'AIML대화';
COMMENT ON COLUMN aiml_main.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_main.id IS '고유 번호';
COMMENT ON COLUMN aiml_main.input IS '질문';
COMMENT ON COLUMN aiml_main.that_id IS '이전 답변 번호';
COMMENT ON COLUMN aiml_main.reply IS '답변';

-- Table: aiml_option

-- DROP TABLE aiml_option;

CREATE TABLE aiml_option
(
  id integer NOT NULL, -- 고유번호
  cate_id integer NOT NULL, -- 대화 카테고리 고유번호
  main_id integer NOT NULL, -- 대화 고유 번호
  val character varying(255) NOT NULL, -- 값
  seq integer NOT NULL, -- 1:키워드검색,2:핸드폰검색,3:이벤트
  CONSTRAINT aiml_option_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_option
  OWNER TO talksearch;
COMMENT ON TABLE aiml_option
  IS '확장필드';
COMMENT ON COLUMN aiml_option.id IS '고유번호';
COMMENT ON COLUMN aiml_option.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_option.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_option.val IS '값';
COMMENT ON COLUMN aiml_option.seq IS '1:키워드검색,2:핸드폰검색,3:이벤트';


-- Index: index_aiml_option_on_main_id

-- DROP INDEX index_aiml_option_on_main_id;

CREATE INDEX index_aiml_option_on_main_id
  ON aiml_option
  USING btree
  (main_id);

-- Table: aiml_pred

-- DROP TABLE aiml_pred;

CREATE TABLE aiml_pred
(
  cate_id integer NOT NULL, -- 카테고리 고유 번호
  name character varying(128) NOT NULL, -- 이름
  basic character varying(128) NOT NULL, -- 기본값
  val character varying(128) NOT NULL, -- 값
  created timestamp(6) without time zone NOT NULL, -- 생성일
  modified timestamp(6) without time zone NOT NULL, -- 수정일
  CONSTRAINT aiml_pred_pkey PRIMARY KEY (cate_id, name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_pred
  OWNER TO talksearch;
COMMENT ON COLUMN aiml_pred.cate_id IS '카테고리 고유 번호';
COMMENT ON COLUMN aiml_pred.name IS '이름';
COMMENT ON COLUMN aiml_pred.basic IS '기본값';
COMMENT ON COLUMN aiml_pred.val IS '값';
COMMENT ON COLUMN aiml_pred.created IS '생성일';
COMMENT ON COLUMN aiml_pred.modified IS '수정일';

-- Table: aiml_predicate

-- DROP TABLE aiml_predicate;

CREATE TABLE aiml_predicate
(
  user_id character varying(100) NOT NULL, -- 사용자 아이디
  bot_id character varying(100) NOT NULL, -- 봇아이디
  name character varying(128) NOT NULL, -- 입력값
  val text NOT NULL, -- 답변
  created timestamp(6) without time zone NOT NULL, -- 생성일
  CONSTRAINT predicate_pkey PRIMARY KEY (user_id, bot_id, name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_predicate
  OWNER TO talksearch;
COMMENT ON TABLE aiml_predicate
  IS '최근 사용자 대화 내역';
COMMENT ON COLUMN aiml_predicate.user_id IS '사용자 아이디';
COMMENT ON COLUMN aiml_predicate.bot_id IS '봇아이디';
COMMENT ON COLUMN aiml_predicate.name IS '입력값';
COMMENT ON COLUMN aiml_predicate.val IS '답변';
COMMENT ON COLUMN aiml_predicate.created IS '생성일';


-- Index: index_aiml_predicate_on_user_id_and_bot_id_and_name

-- DROP INDEX index_aiml_predicate_on_user_id_and_bot_id_and_name;

CREATE INDEX index_aiml_predicate_on_user_id_and_bot_id_and_name
  ON aiml_predicate
  USING btree
  (user_id COLLATE pg_catalog."default", bot_id COLLATE pg_catalog."default", name COLLATE pg_catalog."default");

-- Index: predicate_created

-- DROP INDEX predicate_created;

CREATE INDEX predicate_created
  ON aiml_predicate
  USING btree
  (created);

-- Table: aiml_prop

-- DROP TABLE aiml_prop;

CREATE TABLE aiml_prop
(
  cate_id integer NOT NULL, -- 카테고리 고유번호
  name character varying(128) NOT NULL, -- 이름
  val character varying(128) NOT NULL, -- 값
  created timestamp(6) without time zone, -- 생성일
  modified timestamp(6) without time zone, -- 수정일
  CONSTRAINT aiml_prop_pkey PRIMARY KEY (cate_id, name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_prop
  OWNER TO talksearch;
COMMENT ON COLUMN aiml_prop.cate_id IS '카테고리 고유번호';
COMMENT ON COLUMN aiml_prop.name IS '이름';
COMMENT ON COLUMN aiml_prop.val IS '값';
COMMENT ON COLUMN aiml_prop.created IS '생성일';
COMMENT ON COLUMN aiml_prop.modified IS '수정일';

-- Table: aiml_recommend

-- DROP TABLE aiml_recommend;

CREATE TABLE aiml_recommend
(
  id integer NOT NULL, -- 고유번호
  cate_id integer NOT NULL, -- 대화 카테고리 고유번호
  main_id integer NOT NULL, -- 대화 고유 번호
  recommend_input character varying(255) NOT NULL, -- 다음 추천 질문
  CONSTRAINT aiml_recommend_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_recommend
  OWNER TO talksearch;
COMMENT ON TABLE aiml_recommend
  IS '다음 추천 질문';
COMMENT ON COLUMN aiml_recommend.id IS '고유번호';
COMMENT ON COLUMN aiml_recommend.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_recommend.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_recommend.recommend_input IS '다음 추천 질문';


-- Index: index_aiml_recommend_on_main_id

-- DROP INDEX index_aiml_recommend_on_main_id;

CREATE INDEX index_aiml_recommend_on_main_id
  ON aiml_recommend
  USING btree
  (main_id);

-- Table: aiml_reply

-- DROP TABLE aiml_reply;

CREATE TABLE aiml_reply
(
  id integer NOT NULL, -- 고유번호
  cate_id integer NOT NULL, -- 대화 카테고리 고유번호
  main_id integer NOT NULL, -- 대화 고유 번호
  reply_input character varying(255) NOT NULL, -- 추가적으로 내보낼 답변에 대한 질문
  CONSTRAINT aiml_reply_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_reply
  OWNER TO talksearch;
COMMENT ON TABLE aiml_reply
  IS '2개 이상의 답변을 보낼 때 추가할 질문 내역 ';
COMMENT ON COLUMN aiml_reply.id IS '고유번호';
COMMENT ON COLUMN aiml_reply.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_reply.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_reply.reply_input IS '추가적으로 내보낼 답변에 대한 질문';


-- Index: index_aiml_reply_on_main_id

-- DROP INDEX index_aiml_reply_on_main_id;

CREATE INDEX index_aiml_reply_on_main_id
  ON aiml_reply
  USING btree
  (main_id);

-- Table: aiml_subs

-- DROP TABLE aiml_subs;

CREATE TABLE aiml_subs
(
  cate_id integer NOT NULL, -- 전처리 카테고리 고유번호
  find character varying(50) NOT NULL, -- 찾을 문자열
  replace character varying(100) NOT NULL, -- 교체 문자열
  created timestamp(6) without time zone NOT NULL, -- 생성일
  modified timestamp(6) without time zone NOT NULL, -- 수정일
  CONSTRAINT aiml_subs_pkey PRIMARY KEY (cate_id, find)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_subs
  OWNER TO talksearch;
COMMENT ON TABLE aiml_subs
  IS '전처리 규칙';
COMMENT ON COLUMN aiml_subs.cate_id IS '전처리 카테고리 고유번호';
COMMENT ON COLUMN aiml_subs.find IS '찾을 문자열';
COMMENT ON COLUMN aiml_subs.replace IS '교체 문자열';
COMMENT ON COLUMN aiml_subs.created IS '생성일';
COMMENT ON COLUMN aiml_subs.modified IS '수정일';

-- Table: aiml_test

-- DROP TABLE aiml_test;

CREATE TABLE aiml_test
(
  id integer NOT NULL, -- 고유번호
  cate_id integer NOT NULL, -- 대화 카테고리 고유번호
  main_id integer NOT NULL, -- 대화 고유 번호
  test_input character varying(255) NOT NULL, -- 테스트 질문
  CONSTRAINT aiml_test_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE aiml_test
  OWNER TO talksearch;
COMMENT ON TABLE aiml_test
  IS '기능 테스트 질문 모음';
COMMENT ON COLUMN aiml_test.id IS '고유번호';
COMMENT ON COLUMN aiml_test.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_test.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_test.test_input IS '테스트 질문';

-- Table: allow_ip

-- DROP TABLE allow_ip;

CREATE TABLE allow_ip
(
  id integer NOT NULL, -- 고유번호
  host_ip character varying(16) NOT NULL, -- 접근 IP
  enabled character(1) NOT NULL DEFAULT 'Y'::bpchar, -- 사용여부
  created timestamp(6) without time zone NOT NULL, -- 생성일
  modified timestamp(6) without time zone NOT NULL, -- 수정일
  cp_id integer NOT NULL, -- cp id
  CONSTRAINT allow_ip_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE allow_ip
  OWNER TO talksearch;
COMMENT ON TABLE allow_ip
  IS '검색 서비스 허용 정보';
COMMENT ON COLUMN allow_ip.id IS '고유번호';
COMMENT ON COLUMN allow_ip.host_ip IS '접근 IP';
COMMENT ON COLUMN allow_ip.enabled IS '사용여부';
COMMENT ON COLUMN allow_ip.created IS '생성일';
COMMENT ON COLUMN allow_ip.modified IS '수정일';
COMMENT ON COLUMN allow_ip.cp_id IS 'cp id';


-- Index: index_allow_ip_on_enabled_and_host_ip

-- DROP INDEX index_allow_ip_on_enabled_and_host_ip;

CREATE INDEX index_allow_ip_on_enabled_and_host_ip
  ON allow_ip
  USING btree
  (enabled COLLATE pg_catalog."default", host_ip COLLATE pg_catalog."default");

-- Table: bot

-- DROP TABLE bot;

CREATE TABLE bot
(
  id integer NOT NULL, -- 고유번호
  cp_id integer NOT NULL, -- 검색서비스고유번호
  sub_label character varying(128) NOT NULL, -- 봇네임명
  active character varying(1) NOT NULL, -- 활성화여부(Y,N)
  CONSTRAINT bot_pkey PRIMARY KEY (id),
  CONSTRAINT bot_sub_label_key UNIQUE (sub_label)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bot
  OWNER TO talksearch;
COMMENT ON COLUMN bot.id IS '고유번호';
COMMENT ON COLUMN bot.cp_id IS '검색서비스고유번호';
COMMENT ON COLUMN bot.sub_label IS '봇네임명';
COMMENT ON COLUMN bot.active IS '활성화여부(Y,N)';


-- Index: index_bot_on_cp_id_and_sub_label

-- DROP INDEX index_bot_on_cp_id_and_sub_label;

CREATE INDEX index_bot_on_cp_id_and_sub_label
  ON bot
  USING btree
  (cp_id, sub_label COLLATE pg_catalog."default");

-- Index: "primary"

-- DROP INDEX "primary";

CREATE UNIQUE INDEX "primary"
  ON bot
  USING btree
  (id);

-- Table: bot_file

-- DROP TABLE bot_file;

CREATE TABLE bot_file
(
  id integer NOT NULL, -- 고유번호
  bot_id integer NOT NULL,
  file_name character varying(128) NOT NULL, -- bot-1.xml...
  path character varying(255) NOT NULL, -- 파일 경로
  last_loaded timestamp(6) without time zone, -- 최근 갱신일
  file_type character varying(4) NOT NULL, -- 파일 종류(SUBS, AIML, PROP,PRED)
  CONSTRAINT bot_file_pkey PRIMARY KEY (id),
  CONSTRAINT bot_file_file_name_key UNIQUE (file_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bot_file
  OWNER TO talksearch;
COMMENT ON TABLE bot_file
  IS '봇 파일명';
COMMENT ON COLUMN bot_file.id IS '고유번호';
COMMENT ON COLUMN bot_file.file_name IS 'bot-1.xml
bot-2.xml
substitutions-1.xml
substitutions-2.xml';
COMMENT ON COLUMN bot_file.path IS '파일 경로';
COMMENT ON COLUMN bot_file.last_loaded IS '최근 갱신일';
COMMENT ON COLUMN bot_file.file_type IS '파일 종류(SUBS, AIML, PROP,PRED)';


-- Index: index_bot_file_on_bot_id_and_file_type

-- DROP INDEX index_bot_file_on_bot_id_and_file_type;

CREATE INDEX index_bot_file_on_bot_id_and_file_type
  ON bot_file
  USING btree
  (bot_id, file_type COLLATE pg_catalog."default");

-- Index: index_bot_file_on_file_name_and_file_type

-- DROP INDEX index_bot_file_on_file_name_and_file_type;

CREATE INDEX index_bot_file_on_file_name_and_file_type
  ON bot_file
  USING btree
  (file_name COLLATE pg_catalog."default", file_type COLLATE pg_catalog."default");

-- Table: chat_category_stat

-- DROP TABLE chat_category_stat;

CREATE TABLE chat_category_stat
(
  cp_label character varying(255) NOT NULL,
  cate_name character varying(128) NOT NULL,
  start_time character varying(20) NOT NULL,
  end_time character varying(20) NOT NULL,
  total_cnt integer NOT NULL,
  CONSTRAINT chat_category_stat_pkey PRIMARY KEY (cp_label, cate_name, start_time)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE chat_category_stat
  OWNER TO talksearch;
COMMENT ON TABLE chat_category_stat
  IS '카테고리 통계';
-- Table: chat_day_stat

-- DROP TABLE chat_day_stat;

CREATE TABLE chat_day_stat
(
  cp_label character varying(255) NOT NULL, -- 봇아이디
  start_time character varying(20) NOT NULL, -- 시작시간
  end_time character varying(20) NOT NULL, -- 종료 시간
  search_count integer NOT NULL, -- 검색건수
  response_count integer NOT NULL, -- 응답건수
  success_percent numeric(19,10) NOT NULL, -- 응답률
  user_count integer NOT NULL, -- 유니크 사용자수
  CONSTRAINT chat_day_stat_pkey PRIMARY KEY (cp_label, start_time, end_time)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE chat_day_stat
  OWNER TO talksearch;
COMMENT ON TABLE chat_day_stat
  IS '검색 일별 통계';
COMMENT ON COLUMN chat_day_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_day_stat.start_time IS '시작시간';
COMMENT ON COLUMN chat_day_stat.end_time IS '종료 시간';
COMMENT ON COLUMN chat_day_stat.search_count IS '검색건수';
COMMENT ON COLUMN chat_day_stat.response_count IS '응답건수';
COMMENT ON COLUMN chat_day_stat.success_percent IS '응답률';
COMMENT ON COLUMN chat_day_stat.user_count IS '유니크 사용자수';

-- Table: chat_input_stat

-- DROP TABLE chat_input_stat;

CREATE TABLE chat_input_stat
(
  cp_label character varying(255) NOT NULL,
  input character varying(255) NOT NULL,
  start_time character varying(20) NOT NULL,
  end_time character varying(20) NOT NULL,
  total_cnt integer NOT NULL,
  CONSTRAINT chat_input_stat_pkey PRIMARY KEY (cp_label, input, start_time)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE chat_input_stat
  OWNER TO talksearch;
COMMENT ON TABLE chat_input_stat
  IS '대화통계';
-- Table: chat_log

-- DROP TABLE chat_log;

CREATE TABLE chat_log
(
  id integer NOT NULL, -- 고유번호
  cp_label character varying(255) NOT NULL, -- 봇아이디
  user_id character varying(50) NOT NULL, -- 아이디
  user_input character varying(255) NOT NULL, -- 사용자가 질문한 입력
  input character varying(255) NOT NULL, -- 질문
  reply text, -- 답변
  cate_name character varying(128), -- 대화 카테고리명
  created timestamp(6) without time zone NOT NULL, -- 생성일
  CONSTRAINT chat_log_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE chat_log
  OWNER TO talksearch;
COMMENT ON TABLE chat_log
  IS '대화내역 로그';
COMMENT ON COLUMN chat_log.id IS '고유번호';
COMMENT ON COLUMN chat_log.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_log.user_id IS '아이디';
COMMENT ON COLUMN chat_log.user_input IS '사용자가 질문한 입력';
COMMENT ON COLUMN chat_log.input IS '질문';
COMMENT ON COLUMN chat_log.reply IS '답변';
COMMENT ON COLUMN chat_log.cate_name IS '대화 카테고리명';
COMMENT ON COLUMN chat_log.created IS '생성일';


-- Index: chat_log_created_idx

-- DROP INDEX chat_log_created_idx;

CREATE INDEX chat_log_created_idx
  ON chat_log
  USING btree
  (created);

-- Index: chat_log_user_input_idx

-- DROP INDEX chat_log_user_input_idx;

CREATE INDEX chat_log_user_input_idx
  ON chat_log
  USING btree
  (user_input COLLATE pg_catalog."default");

-- Table: chat_log_process

-- DROP TABLE chat_log_process;

CREATE TABLE chat_log_process
(
  id integer NOT NULL, -- 고유 번호
  cp_label character varying(255) NOT NULL, -- 봇 아이디
  user_input character varying(255) NOT NULL, -- 처리한(할) 질문 내역
  type character varying(1) NOT NULL, -- 처리상태 ( S:신규 P:확인필요 E:처리완료 )
  created timestamp(6) without time zone NOT NULL DEFAULT now(), -- 최초 처리 시간
  CONSTRAINT chat_log_process_pkey PRIMARY KEY (id),
  CONSTRAINT chat_log_process_cp_label_user_input_key UNIQUE (cp_label, user_input)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE chat_log_process
  OWNER TO talksearch;
COMMENT ON TABLE chat_log_process
  IS '고객 질문을 처리한 내역';
COMMENT ON COLUMN chat_log_process.id IS '고유 번호';
COMMENT ON COLUMN chat_log_process.cp_label IS '봇 아이디';
COMMENT ON COLUMN chat_log_process.user_input IS '처리한(할) 질문 내역';
COMMENT ON COLUMN chat_log_process.type IS '처리상태 ( S:신규 P:확인필요 E:처리완료 )';
COMMENT ON COLUMN chat_log_process.created IS '최초 처리 시간';

-- Table: chat_month_stat

-- DROP TABLE chat_month_stat;

CREATE TABLE chat_month_stat
(
  cp_label character varying(255) NOT NULL, -- 봇아이디
  start_time character varying(20) NOT NULL, -- 시작시간
  end_time character varying(20) NOT NULL, -- 종료 시간
  search_count integer NOT NULL, -- 검색건수
  response_count integer NOT NULL, -- 응답건수
  success_percent numeric(19,10) NOT NULL, -- 응답률
  user_count integer NOT NULL, -- 유니크 사용자수
  CONSTRAINT chat_month_stat_pkey PRIMARY KEY (cp_label, start_time, end_time)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE chat_month_stat
  OWNER TO talksearch;
COMMENT ON TABLE chat_month_stat
  IS '검색 월별 통계';
COMMENT ON COLUMN chat_month_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_month_stat.start_time IS '시작시간';
COMMENT ON COLUMN chat_month_stat.end_time IS '종료 시간';
COMMENT ON COLUMN chat_month_stat.search_count IS '검색건수';
COMMENT ON COLUMN chat_month_stat.response_count IS '응답건수';
COMMENT ON COLUMN chat_month_stat.success_percent IS '응답률';
COMMENT ON COLUMN chat_month_stat.user_count IS '유니크 사용자수';

-- Table: chat_time_stat

-- DROP TABLE chat_time_stat;

CREATE TABLE chat_time_stat
(
  cp_label character varying(255) NOT NULL, -- 봇아이디
  start_time character varying(20) NOT NULL, -- 시작시간
  end_time character varying(20) NOT NULL, -- 종료 시간
  search_count integer NOT NULL, -- 검색건수
  response_count integer NOT NULL, -- 응답건수
  success_percent numeric(19,10) NOT NULL, -- 응답률
  user_count integer NOT NULL, -- 유니크 사용자수
  CONSTRAINT chat_time_stat_pkey PRIMARY KEY (cp_label, start_time, end_time)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE chat_time_stat
  OWNER TO talksearch;
COMMENT ON TABLE chat_time_stat
  IS '시간대별 통계';
COMMENT ON COLUMN chat_time_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_time_stat.start_time IS '시작시간';
COMMENT ON COLUMN chat_time_stat.end_time IS '종료 시간';
COMMENT ON COLUMN chat_time_stat.search_count IS '검색건수';
COMMENT ON COLUMN chat_time_stat.response_count IS '응답건수';
COMMENT ON COLUMN chat_time_stat.success_percent IS '응답률';
COMMENT ON COLUMN chat_time_stat.user_count IS '유니크 사용자수';

-- Table: chat_user_input_stat

-- DROP TABLE chat_user_input_stat;

CREATE TABLE chat_user_input_stat
(
  cp_label character varying(255) NOT NULL,
  user_input character varying(255) NOT NULL,
  start_time character varying(20) NOT NULL,
  end_time character varying(20) NOT NULL,
  total_cnt integer NOT NULL,
  CONSTRAINT chat_user_input_stat_pkey PRIMARY KEY (cp_label, user_input, start_time)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE chat_user_input_stat
  OWNER TO talksearch;
COMMENT ON TABLE chat_user_input_stat
  IS '사용자 질문 통계';
-- Table: chat_user_stat

-- DROP TABLE chat_user_stat;

CREATE TABLE chat_user_stat
(
  cp_label character varying(255) NOT NULL,
  user_id character varying(50) NOT NULL,
  start_time character varying(20) NOT NULL,
  end_time character varying(20) NOT NULL,
  search_count integer NOT NULL,
  response_count integer NOT NULL,
  success_percent numeric(19,10) NOT NULL,
  CONSTRAINT chat_user_stat_pkey PRIMARY KEY (cp_label, user_id, start_time, end_time)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE chat_user_stat
  OWNER TO talksearch;
COMMENT ON TABLE chat_user_stat
  IS '사용자별 통계 ';
-- Table: click_stat

-- DROP TABLE click_stat;

CREATE TABLE click_stat
(
  link_id integer NOT NULL, -- 사용자가 클릭한 링크의 아이디 값
  label character varying(255) NOT NULL,
  token character varying(32) NOT NULL, -- 연동에 필요한 토큰 값
  user_id character varying(128) NOT NULL, -- 사용자 구분값
  chat character varying(255) NOT NULL, -- 대화내역
  created timestamp(6) without time zone NOT NULL -- 생성일
)
WITH (
  OIDS=FALSE
);
ALTER TABLE click_stat
  OWNER TO talksearch;
COMMENT ON TABLE click_stat
  IS '링크 클릭 통계';
COMMENT ON COLUMN click_stat.link_id IS '사용자가 클릭한 링크의 아이디 값';
COMMENT ON COLUMN click_stat.token IS '연동에 필요한 토큰 값';
COMMENT ON COLUMN click_stat.user_id IS '사용자 구분값';
COMMENT ON COLUMN click_stat.chat IS '대화내역';
COMMENT ON COLUMN click_stat.created IS '생성일';

-- Table: cp

-- DROP TABLE cp;

CREATE TABLE cp
(
  id integer NOT NULL, -- 검색 서비스 고유번호
  label character varying(255) NOT NULL, -- SampleBot
  url character varying(255), -- 서비스 접근 URL
  created timestamp(6) without time zone NOT NULL, -- 생성일
  modified timestamp(6) without time zone NOT NULL, -- 수정일
  token character varying(32) NOT NULL, -- api 서비스 키
  description character varying(255), -- 설명
  enabled character(1), -- 사용여부
  CONSTRAINT cp_pkey PRIMARY KEY (id),
  CONSTRAINT cp_label_key UNIQUE (label),
  CONSTRAINT cp_token_key UNIQUE (token)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE cp
  OWNER TO talksearch;
COMMENT ON TABLE cp
  IS '검색 서비스';
COMMENT ON COLUMN cp.id IS '검색 서비스 고유번호';
COMMENT ON COLUMN cp.label IS 'SampleBot';
COMMENT ON COLUMN cp.url IS '서비스 접근 URL';
COMMENT ON COLUMN cp.created IS '생성일';
COMMENT ON COLUMN cp.modified IS '수정일';
COMMENT ON COLUMN cp.token IS 'api 서비스 키';
COMMENT ON COLUMN cp.description IS '설명';
COMMENT ON COLUMN cp.enabled IS '사용여부';


-- Index: index_cp_on_cp_token

-- DROP INDEX index_cp_on_cp_token;

CREATE UNIQUE INDEX index_cp_on_cp_token
  ON cp
  USING btree
  (token COLLATE pg_catalog."default");

-- Index: index_cp_on_token_and_label

-- DROP INDEX index_cp_on_token_and_label;

CREATE INDEX index_cp_on_token_and_label
  ON cp
  USING btree
  (token COLLATE pg_catalog."default", label COLLATE pg_catalog."default");

-- Table: cp_group

-- DROP TABLE cp_group;

CREATE TABLE cp_group
(
  cp_id integer NOT NULL,
  cp_user_id integer NOT NULL,
  CONSTRAINT cp_group_pkey PRIMARY KEY (cp_id, cp_user_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE cp_group
  OWNER TO talksearch;
-- Table: cp_user

-- DROP TABLE cp_user;

CREATE TABLE cp_user
(
  id integer NOT NULL, -- 고유번호
  user_id character varying(50) NOT NULL, -- 아이디
  user_pwd character varying(128) NOT NULL, -- 패스워드 (added by Kihyun)
  name character varying(128) NOT NULL, -- 관리자명
  cell_phone character varying(255), -- 핸드폰 번호
  enabled character(1) NOT NULL DEFAULT 'Y'::bpchar, -- 사용여부(Y,N)
  created timestamp(6) without time zone NOT NULL, -- 생성일
  modified timestamp(6) without time zone NOT NULL, -- 수정일
  cp_id integer NOT NULL, -- 검색 서비스 고유 번호
  description character varying(255), -- 설명
  auth character varying(3) NOT NULL, -- 인증
  menu character varying(4000), -- 권한
  group_name character varying(200), -- 그룹명
  last_login timestamp(6) without time zone, -- 마지막 로그인 시간
  CONSTRAINT cp_user_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE cp_user
  OWNER TO talksearch;
COMMENT ON TABLE cp_user
  IS 'CMS 사용자';
COMMENT ON COLUMN cp_user.id IS '고유번호';
COMMENT ON COLUMN cp_user.user_id IS '아이디';
COMMENT ON COLUMN cp_user.user_pwd IS '패스워드';
COMMENT ON COLUMN cp_user.name IS '관리자명';
COMMENT ON COLUMN cp_user.cell_phone IS '핸드폰 번호';
COMMENT ON COLUMN cp_user.enabled IS '사용여부(Y,N)';
COMMENT ON COLUMN cp_user.created IS '생성일';
COMMENT ON COLUMN cp_user.modified IS '수정일';
COMMENT ON COLUMN cp_user.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN cp_user.description IS '설명';
COMMENT ON COLUMN cp_user.auth IS '인증';
COMMENT ON COLUMN cp_user.menu IS '권한';
COMMENT ON COLUMN cp_user.group_name IS '그룹명';
COMMENT ON COLUMN cp_user.last_login IS '마지막 로그인 시간 ';


-- Index: "user"

-- DROP INDEX "user";

CREATE UNIQUE INDEX "user"
  ON cp_user
  USING btree
  (user_id COLLATE pg_catalog."default");

-- Table: deploy_aiml_category

-- DROP TABLE deploy_aiml_category;

CREATE TABLE deploy_aiml_category
(
  cp_id integer NOT NULL, -- 검색 서비스 고유 번호
  cate_id integer NOT NULL, -- 대화 카테고리 고유번호
  CONSTRAINT deploy_aiml_category_pkey PRIMARY KEY (cp_id, cate_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE deploy_aiml_category
  OWNER TO talksearch;
COMMENT ON TABLE deploy_aiml_category
  IS '대화 배포 카테고리';
COMMENT ON COLUMN deploy_aiml_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN deploy_aiml_category.cate_id IS '대화 카테고리 고유번호';

-- Table: deploy_history

-- DROP TABLE deploy_history;

CREATE TABLE deploy_history
(
  id integer NOT NULL, -- 고유번호
  scheduler_id integer NOT NULL, -- 스케줄러 고유 번호(봇 변경일 경우 0)
  file_name character varying(128) NOT NULL, -- 파일경로 + 파일명
  file_body text, -- 파일 본문
  file_type character varying(4), -- 파일종류
  created timestamp(6) without time zone NOT NULL, -- 생성일
  description text, -- 부연설명
  CONSTRAINT deploy_history_pkey PRIMARY KEY (id, scheduler_id, file_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE deploy_history
  OWNER TO talksearch;
COMMENT ON TABLE deploy_history
  IS '대화 배포 내역';
COMMENT ON COLUMN deploy_history.id IS '고유번호';
COMMENT ON COLUMN deploy_history.scheduler_id IS '스케줄러 고유 번호(봇 변경일 경우 0)';
COMMENT ON COLUMN deploy_history.file_name IS '파일경로 + 파일명';
COMMENT ON COLUMN deploy_history.file_body IS '파일 본문';
COMMENT ON COLUMN deploy_history.file_type IS '파일종류';
COMMENT ON COLUMN deploy_history.created IS '생성일';
COMMENT ON COLUMN deploy_history.description IS '부연설명';

-- Table: deploy_node_history

-- DROP TABLE deploy_node_history;

CREATE TABLE deploy_node_history
(
  scheduler_id integer NOT NULL, -- 배포 스케줄러 고유번호
  host_ip character varying(16) NOT NULL, -- IP
  file_name character varying(512) NOT NULL, -- 파일명
  created timestamp(6) without time zone NOT NULL, -- 생성일
  modified timestamp(6) without time zone NOT NULL, -- 수정일
  write_success character varying(1) NOT NULL, -- 파일 쓰기 완료 여부
  read_success character varying(1) NOT NULL, -- 파일 읽기 완료 여부
  err_msg text, -- 에러가 난 구문
  CONSTRAINT deploy_node_history_pkey PRIMARY KEY (scheduler_id, host_ip, file_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE deploy_node_history
  OWNER TO talksearch;
COMMENT ON TABLE deploy_node_history
  IS 'API 호스트 서버별 배포 정보';
COMMENT ON COLUMN deploy_node_history.scheduler_id IS '배포 스케줄러 고유번호';
COMMENT ON COLUMN deploy_node_history.host_ip IS 'IP';
COMMENT ON COLUMN deploy_node_history.file_name IS '파일명';
COMMENT ON COLUMN deploy_node_history.created IS '생성일';
COMMENT ON COLUMN deploy_node_history.modified IS '수정일';
COMMENT ON COLUMN deploy_node_history.write_success IS '파일 쓰기 완료 여부';
COMMENT ON COLUMN deploy_node_history.read_success IS '파일 읽기 완료 여부';
COMMENT ON COLUMN deploy_node_history.err_msg IS '에러가 난 구문';


-- Index: index_deploy_node_history_on_scheduler_id_and_host_ip

-- DROP INDEX index_deploy_node_history_on_scheduler_id_and_host_ip;

CREATE INDEX index_deploy_node_history_on_scheduler_id_and_host_ip
  ON deploy_node_history
  USING btree
  (scheduler_id, host_ip COLLATE pg_catalog."default");

-- Table: deploy_pred_category

-- DROP TABLE deploy_pred_category;

CREATE TABLE deploy_pred_category
(
  cp_id integer NOT NULL, -- 검색 서비스 고유 번호
  cate_id integer NOT NULL, -- 카테고리 고유 번호
  CONSTRAINT deploy_pred_category_pkey PRIMARY KEY (cp_id, cate_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE deploy_pred_category
  OWNER TO talksearch;
COMMENT ON TABLE deploy_pred_category
  IS 'predicates 배포 카테고리';
COMMENT ON COLUMN deploy_pred_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN deploy_pred_category.cate_id IS '카테고리 고유 번호';

-- Table: deploy_prop_category

-- DROP TABLE deploy_prop_category;

CREATE TABLE deploy_prop_category
(
  cp_id integer NOT NULL, -- 검색 서비스 고유 번호
  cate_id integer NOT NULL, -- 카테고리 고유 번호
  CONSTRAINT deploy_prop_category_pkey PRIMARY KEY (cp_id, cate_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE deploy_prop_category
  OWNER TO talksearch;
COMMENT ON TABLE deploy_prop_category
  IS 'properties 카테고리';
COMMENT ON COLUMN deploy_prop_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN deploy_prop_category.cate_id IS '카테고리 고유 번호';

-- Table: deploy_scheduler

-- DROP TABLE deploy_scheduler;

CREATE TABLE deploy_scheduler
(
  id integer NOT NULL, -- 고유번호
  deploy_date timestamp(6) without time zone NOT NULL, -- 배포년월일시분초
  cp_id integer NOT NULL, -- 검색 서비스 고유 번호
  completed character varying(1) NOT NULL, -- 완료 여부('Y','N', "F")
  description character varying(255) NOT NULL, -- 설명
  user_id character varying(50) NOT NULL, -- 작업자아이디
  gubun character varying(100) NOT NULL, -- 작업구분("배포","BOT변경")
  sub_label character varying(128) NOT NULL, -- 봇네임명
  CONSTRAINT deploy_scheduler_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE deploy_scheduler
  OWNER TO talksearch;
COMMENT ON TABLE deploy_scheduler
  IS '파일 배포 스케줄러';
COMMENT ON COLUMN deploy_scheduler.id IS '고유번호';
COMMENT ON COLUMN deploy_scheduler.deploy_date IS '배포년월일시분초';
COMMENT ON COLUMN deploy_scheduler.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN deploy_scheduler.completed IS '완료 여부(''Y'',''N'', "F")';
COMMENT ON COLUMN deploy_scheduler.description IS '설명';
COMMENT ON COLUMN deploy_scheduler.user_id IS '작업자아이디';
COMMENT ON COLUMN deploy_scheduler.gubun IS '작업구분("배포","BOT변경")';
COMMENT ON COLUMN deploy_scheduler.sub_label IS '봇네임명';


-- Index: index_deploy_scheduler_on_completed_and_gubun

-- DROP INDEX index_deploy_scheduler_on_completed_and_gubun;

CREATE INDEX index_deploy_scheduler_on_completed_and_gubun
  ON deploy_scheduler
  USING btree
  (completed COLLATE pg_catalog."default", gubun COLLATE pg_catalog."default");

-- Index: index_deploy_scheduler_on_cp_id

-- DROP INDEX index_deploy_scheduler_on_cp_id;

CREATE INDEX index_deploy_scheduler_on_cp_id
  ON deploy_scheduler
  USING btree
  (cp_id);

-- Index: index_deploy_scheduler_on_sub_label_and_completed_and_gubun

-- DROP INDEX index_deploy_scheduler_on_sub_label_and_completed_and_gubun;

CREATE INDEX index_deploy_scheduler_on_sub_label_and_completed_and_gubun
  ON deploy_scheduler
  USING btree
  (sub_label COLLATE pg_catalog."default", completed COLLATE pg_catalog."default", gubun COLLATE pg_catalog."default");

-- Table: deploy_subs_category

-- DROP TABLE deploy_subs_category;

CREATE TABLE deploy_subs_category
(
  cp_id integer NOT NULL, -- 검색 서비스 고유 번호
  cate_id integer NOT NULL, -- 전처리 카테고리 고유번호
  CONSTRAINT deploy_subs_category_pkey PRIMARY KEY (cp_id, cate_id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE deploy_subs_category
  OWNER TO talksearch;
COMMENT ON TABLE deploy_subs_category
  IS '전처리 배포 카테고리';
COMMENT ON COLUMN deploy_subs_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN deploy_subs_category.cate_id IS '전처리 카테고리 고유번호';

-- Table: pred_category

-- DROP TABLE pred_category;

CREATE TABLE pred_category
(
  id integer NOT NULL, -- 고유 번호
  cp_id integer NOT NULL, -- 검색 서비스 고유 번호
  name character varying(128) NOT NULL, -- 이름
  created timestamp(6) without time zone NOT NULL, -- 생성일
  modified timestamp(6) without time zone NOT NULL, -- 수정일
  restriction character varying(7) NOT NULL, -- 접근권한(all, owner)
  enabled character varying(1) NOT NULL, -- 활성화여부(Y,N)
  CONSTRAINT pred_category_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE pred_category
  OWNER TO talksearch;
COMMENT ON TABLE pred_category
  IS 'predicates 카테고리';
COMMENT ON COLUMN pred_category.id IS '고유 번호';
COMMENT ON COLUMN pred_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN pred_category.name IS '이름';
COMMENT ON COLUMN pred_category.created IS '생성일';
COMMENT ON COLUMN pred_category.modified IS '수정일';
COMMENT ON COLUMN pred_category.restriction IS '접근권한(all, owner)';
COMMENT ON COLUMN pred_category.enabled IS '활성화여부(Y,N)';

-- Table: prop_category

-- DROP TABLE prop_category;

CREATE TABLE prop_category
(
  id integer NOT NULL, -- 고유번호
  cp_id integer NOT NULL, -- 검색 서비스 고유 번호
  name character varying(128) NOT NULL, -- 이름
  created timestamp(6) without time zone NOT NULL, -- 생성일
  modified timestamp(6) without time zone NOT NULL, -- 수정일
  restriction character varying(7) NOT NULL, -- 접근권한(all, owner)
  enabled character varying(1) NOT NULL DEFAULT 'Y'::character varying, -- 활성화여부(Y,N)
  CONSTRAINT prop_category_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE prop_category
  OWNER TO talksearch;
COMMENT ON TABLE prop_category
  IS 'properties 카테고리';
COMMENT ON COLUMN prop_category.id IS '고유번호';
COMMENT ON COLUMN prop_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN prop_category.name IS '이름';
COMMENT ON COLUMN prop_category.created IS '생성일';
COMMENT ON COLUMN prop_category.modified IS '수정일';
COMMENT ON COLUMN prop_category.restriction IS '접근권한(all, owner)';
COMMENT ON COLUMN prop_category.enabled IS '활성화여부(Y,N)';

-- Table: repository

-- DROP TABLE repository;

CREATE TABLE repository
(
  object_key character varying(100) NOT NULL, -- 오브젝트 키값
  key character varying(100) NOT NULL, -- 키값
  value text NOT NULL, -- 데이터 값
  created timestamp(6) without time zone NOT NULL DEFAULT now(), -- 생성일
  CONSTRAINT repository_pkey PRIMARY KEY (object_key, key)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE repository
  OWNER TO talksearch;
COMMENT ON TABLE repository
  IS 'programd 기본 데이터 저장소';
COMMENT ON COLUMN repository.object_key IS '오브젝트 키값';
COMMENT ON COLUMN repository.key IS '키값';
COMMENT ON COLUMN repository.value IS '데이터 값';
COMMENT ON COLUMN repository.created IS '생성일';

-- Table: sample

-- DROP TABLE sample;

CREATE TABLE sample
(
  id character varying(100) NOT NULL,
  name character varying(100),
  password character varying(100),
  CONSTRAINT sample_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE sample
  OWNER TO talksearch;
COMMENT ON TABLE sample
  IS 'sampe table';
-- Table: subs_category

-- DROP TABLE subs_category;

CREATE TABLE subs_category
(
  id integer NOT NULL, -- 전처리 카테고리 고유 번호
  name character varying(128) NOT NULL, -- 카테고리명
  created timestamp(6) without time zone NOT NULL, -- 생성일
  modified timestamp(6) without time zone NOT NULL, -- 수정일
  restriction character varying(7) NOT NULL DEFAULT 'owner'::character varying, -- 접근권한(all, owner)
  cp_id integer NOT NULL, -- 검색서비스고유번호(관리자가 생성한 것은 0)
  enabled character varying(1) NOT NULL, -- 활성화여부(Y,N)
  CONSTRAINT subs_category_pkey PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE subs_category
  OWNER TO talksearch;
COMMENT ON TABLE subs_category
  IS '전처리 카테고리';
COMMENT ON COLUMN subs_category.id IS '전처리 카테고리 고유 번호';
COMMENT ON COLUMN subs_category.name IS '카테고리명';
COMMENT ON COLUMN subs_category.created IS '생성일';
COMMENT ON COLUMN subs_category.modified IS '수정일';
COMMENT ON COLUMN subs_category.restriction IS '접근권한(all, owner)';
COMMENT ON COLUMN subs_category.cp_id IS '검색서비스고유번호(관리자가 생성한 것은 0)';
COMMENT ON COLUMN subs_category.enabled IS '활성화여부(Y,N)';

-- Sequence: seq_access_ip

-- DROP SEQUENCE seq_access_ip;

CREATE SEQUENCE seq_access_ip
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_access_ip
  OWNER TO talksearch;

-- Sequence: seq_aiml_category

-- DROP SEQUENCE seq_aiml_category;

CREATE SEQUENCE seq_aiml_category
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_aiml_category
  OWNER TO talksearch;

-- Sequence: seq_aiml_images

-- DROP SEQUENCE seq_aiml_images;

CREATE SEQUENCE seq_aiml_images
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_aiml_images
  OWNER TO talksearch;

-- Sequence: seq_aiml_link

-- DROP SEQUENCE seq_aiml_link;

CREATE SEQUENCE seq_aiml_link
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_aiml_link
  OWNER TO talksearch;

-- Sequence: seq_aiml_main

-- DROP SEQUENCE seq_aiml_main;

CREATE SEQUENCE seq_aiml_main
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1000000000
  CACHE 1;
ALTER TABLE seq_aiml_main
  OWNER TO talksearch;

-- Sequence: seq_aiml_opt

-- DROP SEQUENCE seq_aiml_opt;

CREATE SEQUENCE seq_aiml_opt
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_aiml_opt
  OWNER TO talksearch;

-- Sequence: seq_aiml_option

-- DROP SEQUENCE seq_aiml_option;

CREATE SEQUENCE seq_aiml_option
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_aiml_option
  OWNER TO talksearch;

-- Sequence: seq_aiml_recommend

-- DROP SEQUENCE seq_aiml_recommend;

CREATE SEQUENCE seq_aiml_recommend
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_aiml_recommend
  OWNER TO talksearch;

-- Sequence: seq_aiml_reply

-- DROP SEQUENCE seq_aiml_reply;

CREATE SEQUENCE seq_aiml_reply
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_aiml_reply
  OWNER TO talksearch;

-- Sequence: seq_aiml_test

-- DROP SEQUENCE seq_aiml_test;

CREATE SEQUENCE seq_aiml_test
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_aiml_test
  OWNER TO talksearch;

-- Sequence: seq_aiml_topic

-- DROP SEQUENCE seq_aiml_topic;

CREATE SEQUENCE seq_aiml_topic
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_aiml_topic
  OWNER TO talksearch;

-- Sequence: seq_allow_ip

-- DROP SEQUENCE seq_allow_ip;

CREATE SEQUENCE seq_allow_ip
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_allow_ip
  OWNER TO talksearch;

-- Sequence: seq_bot

-- DROP SEQUENCE seq_bot;

CREATE SEQUENCE seq_bot
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_bot
  OWNER TO talksearch;

-- Sequence: seq_bot_file

-- DROP SEQUENCE seq_bot_file;

CREATE SEQUENCE seq_bot_file
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_bot_file
  OWNER TO talksearch;

-- Sequence: seq_chat_log

-- DROP SEQUENCE seq_chat_log;

CREATE SEQUENCE seq_chat_log
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_chat_log
  OWNER TO talksearch;

-- Sequence: seq_chat_log_process

-- DROP SEQUENCE seq_chat_log_process;

CREATE SEQUENCE seq_chat_log_process
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_chat_log_process
  OWNER TO talksearch;

-- Sequence: seq_cp

-- DROP SEQUENCE seq_cp;

CREATE SEQUENCE seq_cp
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 2
  CACHE 1;
ALTER TABLE seq_cp
  OWNER TO talksearch;

-- Sequence: seq_cp_user

-- DROP SEQUENCE seq_cp_user;

CREATE SEQUENCE seq_cp_user
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 2
  CACHE 1;
ALTER TABLE seq_cp_user
  OWNER TO talksearch;

-- Sequence: seq_deploy_history

-- DROP SEQUENCE seq_deploy_history;

CREATE SEQUENCE seq_deploy_history
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_deploy_history
  OWNER TO talksearch;

-- Sequence: seq_deploy_scheduler

-- DROP SEQUENCE seq_deploy_scheduler;

CREATE SEQUENCE seq_deploy_scheduler
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_deploy_scheduler
  OWNER TO talksearch;

-- Sequence: seq_pred_category

-- DROP SEQUENCE seq_pred_category;

CREATE SEQUENCE seq_pred_category
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_pred_category
  OWNER TO talksearch;

-- Sequence: seq_prop_category

-- DROP SEQUENCE seq_prop_category;

CREATE SEQUENCE seq_prop_category
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_prop_category
  OWNER TO talksearch;

-- Sequence: seq_subs_category

-- DROP SEQUENCE seq_subs_category;

CREATE SEQUENCE seq_subs_category
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE seq_subs_category
  OWNER TO talksearch;

-- SuperBot CP 생성
INSERT INTO cp( id, label, url, created, modified, token, description, enabled )
  VALUES (1, 'SuperBot', 'http://test.com', now(), now(), 'bca2dc0f757c491db24f996120dd5a78', 'SUPER BOT', 'Y');

-- CP User 생성 (initial pwd : 1234)
INSERT INTO cp_user(
id, user_id, user_pwd, name, cell_phone, enabled, created, modified, cp_id, description, auth, menu, group_name, last_login)
VALUES (1, 'admin', 'MTIzNA==', '관리자', '010-0000-0000', 'Y', now(), now(), 1, '관리자', 'SAA', 'A000,B000,C000,D000,E000,F000,G000,H000', '관리자', now());

-- CP User Goup생성
INSERT INTO cp_group(cp_id, cp_user_id)
VALUES (1, 1);