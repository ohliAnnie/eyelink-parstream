CREATE TABLE cp_group (
  cp_id      int4 NOT NULL,
  cp_user_id int4 NOT NULL,
  PRIMARY KEY (cp_id,
  cp_user_id));
COMMENT ON TABLE cp_group IS '사용자별 CP 그룹';
CREATE TABLE chat_month_stat (
  cp_label        varchar(255) NOT NULL,
  start_time      varchar(20) NOT NULL,
  end_time        varchar(20) NOT NULL,
  search_count    int4 NOT NULL,
  response_count  int4 NOT NULL,
  success_percent numeric(19, 10) NOT NULL,
  user_count      int4 NOT NULL,
  PRIMARY KEY (cp_label,
  start_time,
  end_time));
COMMENT ON TABLE chat_month_stat IS '검색 월별 통계';
COMMENT ON COLUMN chat_month_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_month_stat.start_time IS '시작시간';
COMMENT ON COLUMN chat_month_stat.end_time IS '종료 시간';
COMMENT ON COLUMN chat_month_stat.search_count IS '검색건수';
COMMENT ON COLUMN chat_month_stat.response_count IS '응답건수';
COMMENT ON COLUMN chat_month_stat.success_percent IS '응답률';
COMMENT ON COLUMN chat_month_stat.user_count IS '유니크 사용자수';
CREATE TABLE chat_day_stat (
  cp_label        varchar(255) NOT NULL,
  start_time      varchar(20) NOT NULL,
  end_time        varchar(20) NOT NULL,
  search_count    int4 NOT NULL,
  response_count  int4 NOT NULL,
  success_percent numeric(19, 10) NOT NULL,
  user_count      int4 NOT NULL,
  PRIMARY KEY (cp_label,
  start_time,
  end_time));
COMMENT ON TABLE chat_day_stat IS '검색 일별 통계';
COMMENT ON COLUMN chat_day_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_day_stat.start_time IS '시작시간';
COMMENT ON COLUMN chat_day_stat.end_time IS '종료 시간';
COMMENT ON COLUMN chat_day_stat.search_count IS '검색건수';
COMMENT ON COLUMN chat_day_stat.response_count IS '응답건수';
COMMENT ON COLUMN chat_day_stat.success_percent IS '응답률';
COMMENT ON COLUMN chat_day_stat.user_count IS '유니크 사용자수';
CREATE TABLE chat_user_input_stat (
  cp_label   varchar(255) NOT NULL,
  user_input varchar(255) NOT NULL,
  start_time varchar(255) NOT NULL,
  end_time   varchar(255) NOT NULL,
  total_cnt  int4 NOT NULL,
  PRIMARY KEY (cp_label,
  user_input,
  start_time));
COMMENT ON TABLE chat_user_input_stat IS '사용자 질문 통계';
COMMENT ON COLUMN chat_user_input_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_user_input_stat.user_input IS '사용자 입력';
COMMENT ON COLUMN chat_user_input_stat.start_time IS '검색시작시간';
COMMENT ON COLUMN chat_user_input_stat.end_time IS '검색 종료 시간';
COMMENT ON COLUMN chat_user_input_stat.total_cnt IS '검색건수';
CREATE TABLE chat_input_stat (
  cp_label   varchar(255) NOT NULL,
  input      varchar(255) NOT NULL,
  start_time varchar(20) NOT NULL,
  end_time   varchar(20) NOT NULL,
  total_cnt  int4 NOT NULL,
  PRIMARY KEY (cp_label,
  input,
  start_time));
COMMENT ON TABLE chat_input_stat IS '대화통계';
COMMENT ON COLUMN chat_input_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_input_stat.input IS '대화내용';
COMMENT ON COLUMN chat_input_stat.start_time IS '검색시작시간';
COMMENT ON COLUMN chat_input_stat.end_time IS '검색 종료시간';
COMMENT ON COLUMN chat_input_stat.total_cnt IS '검색건수';
CREATE TABLE chat_category_stat (
  cp_label   varchar(255) NOT NULL,
  cate_name  varchar(128) NOT NULL,
  start_time varchar(20) NOT NULL,
  end_time   varchar(20) NOT NULL,
  total_cnt  int4 NOT NULL,
  PRIMARY KEY (cp_label,
  cate_name,
  start_time));
COMMENT ON TABLE chat_category_stat IS '카테고리 통계';
COMMENT ON COLUMN chat_category_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_category_stat.cate_name IS '카테고리명';
COMMENT ON COLUMN chat_category_stat.start_time IS '검색시작시간';
COMMENT ON COLUMN chat_category_stat.end_time IS '검색종료시간';
COMMENT ON COLUMN chat_category_stat.total_cnt IS '검색 건수';
CREATE TABLE chat_user_stat (
  cp_label        varchar(255) NOT NULL,
  user_id         varchar(50) NOT NULL,
  start_time      varchar(20) NOT NULL,
  end_time        varchar(20) NOT NULL,
  search_count    int4 NOT NULL,
  response_count  int4 NOT NULL,
  success_percent numeric(19, 10) NOT NULL,
  PRIMARY KEY (cp_label,
  user_id,
  start_time,
  end_time));
COMMENT ON TABLE chat_user_stat IS '사용자별 통계 ';
COMMENT ON COLUMN chat_user_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_user_stat.user_id IS '사용자 아이디';
COMMENT ON COLUMN chat_user_stat.start_time IS '시작시간';
COMMENT ON COLUMN chat_user_stat.end_time IS '종료시간';
COMMENT ON COLUMN chat_user_stat.search_count IS '검색건수';
COMMENT ON COLUMN chat_user_stat.response_count IS '응답건수';
COMMENT ON COLUMN chat_user_stat.success_percent IS '응답률';
CREATE TABLE chat_time_stat (
  cp_label        varchar(255) NOT NULL,
  start_time      varchar(20) NOT NULL,
  end_time        varchar(20) NOT NULL,
  search_count    int4 NOT NULL,
  response_count  int4 NOT NULL,
  success_percent numeric(19, 10) NOT NULL,
  user_count      int4 NOT NULL,
  PRIMARY KEY (cp_label,
  start_time,
  end_time));
COMMENT ON TABLE chat_time_stat IS '시간대별 통계';
COMMENT ON COLUMN chat_time_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_time_stat.start_time IS '시작시간';
COMMENT ON COLUMN chat_time_stat.end_time IS '종료 시간';
COMMENT ON COLUMN chat_time_stat.search_count IS '검색건수';
COMMENT ON COLUMN chat_time_stat.response_count IS '응답건수';
COMMENT ON COLUMN chat_time_stat.success_percent IS '응답률';
COMMENT ON COLUMN chat_time_stat.user_count IS '유니크 사용자수';
CREATE TABLE aiml_option (
  id      int4 NOT NULL,
  cate_id int4 NOT NULL,
  main_id int4 NOT NULL,
  val     text NOT NULL,
  seq     int4 NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE aiml_option IS '확장필드';
COMMENT ON COLUMN aiml_option.id IS '고유번호';
COMMENT ON COLUMN aiml_option.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_option.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_option.val IS '값';
COMMENT ON COLUMN aiml_option.seq IS '1:키워드검색,2:핸드폰검색,3:이벤트';
CREATE TABLE deploy_history (
  id           int4 NOT NULL,
  scheduler_id int4 NOT NULL,
  file_name    varchar(128) NOT NULL,
  file_body    text,
  file_type    varchar(4),
  created      timestamp(6) NOT NULL,
  description  text,
  PRIMARY KEY (id,
  scheduler_id,
  file_name));
COMMENT ON TABLE deploy_history IS '대화 배포 내역';
COMMENT ON COLUMN deploy_history.id IS '고유번호';
COMMENT ON COLUMN deploy_history.scheduler_id IS '스케줄러 고유 번호(봇 변경일 경우 0)';
COMMENT ON COLUMN deploy_history.file_name IS '파일경로 + 파일명';
COMMENT ON COLUMN deploy_history.file_body IS '파일 본문';
COMMENT ON COLUMN deploy_history.file_type IS '파일종류';
COMMENT ON COLUMN deploy_history.created IS '생성일';
COMMENT ON COLUMN deploy_history.description IS '부연설명';
CREATE TABLE bot (
  id        int4 NOT NULL,
  cp_id     int4 NOT NULL,
  sub_label varchar(128) NOT NULL UNIQUE,
  active    varchar(1) NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE bot IS '봇아이디 관리';
COMMENT ON COLUMN bot.id IS '고유번호';
COMMENT ON COLUMN bot.cp_id IS '검색서비스고유번호';
COMMENT ON COLUMN bot.sub_label IS '봇네임명';
COMMENT ON COLUMN bot.active IS '활성화여부(Y,N)';
CREATE TABLE aiml_reply (
  id          int4 NOT NULL,
  cate_id     int4 NOT NULL,
  main_id     int4 NOT NULL,
  reply_input varchar(255) NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE aiml_reply IS '2개 이상의 답변을 보낼 때 추가할 질문 내역 ';
COMMENT ON COLUMN aiml_reply.id IS '고유번호';
COMMENT ON COLUMN aiml_reply.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_reply.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_reply.reply_input IS '추가적으로 내보낼 답변에 대한 질문';
CREATE TABLE aiml_test (
  id         int4 NOT NULL,
  cate_id    int4 NOT NULL,
  main_id    int4 NOT NULL,
  test_input varchar(255) NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE aiml_test IS '기능 테스트 질문 모음';
COMMENT ON COLUMN aiml_test.id IS '고유번호';
COMMENT ON COLUMN aiml_test.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_test.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_test.test_input IS '테스트 질문';
CREATE TABLE deploy_pred_category (
  cp_id   int4 NOT NULL,
  cate_id int4 NOT NULL,
  PRIMARY KEY (cp_id,
  cate_id));
COMMENT ON TABLE deploy_pred_category IS 'predicates 배포 카테고리';
COMMENT ON COLUMN deploy_pred_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN deploy_pred_category.cate_id IS '카테고리 고유 번호';
CREATE TABLE deploy_prop_category (
  cp_id   int4 NOT NULL,
  cate_id int4 NOT NULL,
  PRIMARY KEY (cp_id,
  cate_id));
COMMENT ON TABLE deploy_prop_category IS 'properties 카테고리';
COMMENT ON COLUMN deploy_prop_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN deploy_prop_category.cate_id IS '카테고리 고유 번호';
CREATE TABLE aiml_pred (
  cate_id  int4 NOT NULL,
  name     varchar(128) NOT NULL,
  basic    varchar(128) NOT NULL,
  val      varchar(128) NOT NULL,
  created  timestamp(6) NOT NULL,
  modified timestamp(6) NOT NULL,
  PRIMARY KEY (cate_id,
  name));
COMMENT ON COLUMN aiml_pred.cate_id IS '카테고리 고유 번호';
COMMENT ON COLUMN aiml_pred.name IS '이름';
COMMENT ON COLUMN aiml_pred.basic IS '기본값';
COMMENT ON COLUMN aiml_pred.val IS '값';
COMMENT ON COLUMN aiml_pred.created IS '생성일';
COMMENT ON COLUMN aiml_pred.modified IS '수정일';
CREATE TABLE aiml_prop (
  cate_id  int4 NOT NULL,
  name     varchar(128) NOT NULL,
  val      varchar(128) NOT NULL,
  created  timestamp(6),
  modified timestamp(6),
  PRIMARY KEY (cate_id,
  name));
COMMENT ON COLUMN aiml_prop.cate_id IS '카테고리 고유번호';
COMMENT ON COLUMN aiml_prop.name IS '이름';
COMMENT ON COLUMN aiml_prop.val IS '값';
COMMENT ON COLUMN aiml_prop.created IS '생성일';
COMMENT ON COLUMN aiml_prop.modified IS '수정일';
CREATE TABLE pred_category (
  id          int4 NOT NULL,
  cp_id       int4 NOT NULL,
  name        varchar(128) NOT NULL,
  created     timestamp(6) NOT NULL,
  modified    timestamp(6) NOT NULL,
  restriction varchar(7) NOT NULL,
  enabled     varchar(1) NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE pred_category IS 'predicates 카테고리';
COMMENT ON COLUMN pred_category.id IS '고유 번호';
COMMENT ON COLUMN pred_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN pred_category.name IS '이름';
COMMENT ON COLUMN pred_category.created IS '생성일';
COMMENT ON COLUMN pred_category.modified IS '수정일';
COMMENT ON COLUMN pred_category.restriction IS '접근권한(all, owner)';
COMMENT ON COLUMN pred_category.enabled IS '활성화여부(Y,N)';
CREATE TABLE prop_category (
  id          int4 NOT NULL,
  cp_id       int4 NOT NULL,
  name        varchar(128) NOT NULL,
  created     timestamp(6) NOT NULL,
  modified    timestamp(6) NOT NULL,
  restriction varchar(7) NOT NULL,
  enabled     varchar(1) DEFAULT 'Y' NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE prop_category IS 'properties 카테고리';
COMMENT ON COLUMN prop_category.id IS '고유번호';
COMMENT ON COLUMN prop_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN prop_category.name IS '이름';
COMMENT ON COLUMN prop_category.created IS '생성일';
COMMENT ON COLUMN prop_category.modified IS '수정일';
COMMENT ON COLUMN prop_category.restriction IS '접근권한(all, owner)';
COMMENT ON COLUMN prop_category.enabled IS '활성화여부(Y,N)';
CREATE TABLE deploy_subs_category (
  cp_id   int4 NOT NULL,
  cate_id int4 NOT NULL,
  PRIMARY KEY (cp_id,
  cate_id));
COMMENT ON TABLE deploy_subs_category IS '전처리 배포 카테고리';
COMMENT ON COLUMN deploy_subs_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN deploy_subs_category.cate_id IS '전처리 카테고리 고유번호';
CREATE TABLE deploy_aiml_category (
  cp_id   int4 NOT NULL,
  cate_id int4 NOT NULL,
  PRIMARY KEY (cp_id,
  cate_id));
COMMENT ON TABLE deploy_aiml_category IS '대화 배포 카테고리';
COMMENT ON COLUMN deploy_aiml_category.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN deploy_aiml_category.cate_id IS '대화 카테고리 고유번호';
CREATE TABLE aiml_images (
  id      int4 NOT NULL,
  cate_id int4 NOT NULL,
  main_id int4 NOT NULL,
  url     varchar(255) NOT NULL,
  alt     varchar(255),
  PRIMARY KEY (id));
COMMENT ON TABLE aiml_images IS '이미지 링크 정보';
COMMENT ON COLUMN aiml_images.id IS '고유 번호';
COMMENT ON COLUMN aiml_images.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_images.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_images.url IS '연결 URL';
COMMENT ON COLUMN aiml_images.alt IS '대체 텍스트';
CREATE TABLE subs_category (
  id          int4 NOT NULL,
  name        varchar(128) NOT NULL,
  created     timestamp(6) NOT NULL,
  modified    timestamp(6) NOT NULL,
  restriction varchar(7) DEFAULT 'owner' NOT NULL,
  cp_id       int4 NOT NULL,
  enabled     varchar(1) NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE subs_category IS '전처리 카테고리';
COMMENT ON COLUMN subs_category.id IS '전처리 카테고리 고유 번호';
COMMENT ON COLUMN subs_category.name IS '카테고리명';
COMMENT ON COLUMN subs_category.created IS '생성일';
COMMENT ON COLUMN subs_category.modified IS '수정일';
COMMENT ON COLUMN subs_category.restriction IS '접근권한(all, owner)';
COMMENT ON COLUMN subs_category.cp_id IS '검색서비스고유번호(관리자가 생성한 것은 0)';
COMMENT ON COLUMN subs_category.enabled IS '활성화여부(Y,N)';
CREATE TABLE aiml_category (
  id          int4 NOT NULL,
  cp_id       int4 NOT NULL,
  name        varchar(128) NOT NULL,
  created     timestamp(6) NOT NULL,
  modified    timestamp(6) NOT NULL,
  restriction varchar(7) DEFAULT 'owner' NOT NULL,
  topic       varchar(1) DEFAULT 'N' NOT NULL,
  topic_name  varchar(128),
  enabled     varchar(1) NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE aiml_category IS 'AIML 대화 카테고리';
COMMENT ON COLUMN aiml_category.id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_category.cp_id IS '검색서비스고유번호(관리자가 생성한 것은 0)';
COMMENT ON COLUMN aiml_category.name IS '대화 카테고리 명';
COMMENT ON COLUMN aiml_category.created IS '생성일';
COMMENT ON COLUMN aiml_category.modified IS '수정일';
COMMENT ON COLUMN aiml_category.restriction IS '접근권한(all, owner)';
COMMENT ON COLUMN aiml_category.topic IS '토픽여부(Y,N)';
COMMENT ON COLUMN aiml_category.topic_name IS '토픽 사용시 이름 재설정이 가능함';
COMMENT ON COLUMN aiml_category.enabled IS '활성화여부(Y,N)';
CREATE TABLE aiml_recommend (
  id              int4 NOT NULL,
  cate_id         int4 NOT NULL,
  main_id         int4 NOT NULL,
  recommend_input varchar(255) NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE aiml_recommend IS '다음 추천 질문';
COMMENT ON COLUMN aiml_recommend.id IS '고유번호';
COMMENT ON COLUMN aiml_recommend.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_recommend.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_recommend.recommend_input IS '다음 추천 질문';
CREATE TABLE deploy_node_history (
  scheduler_id  int4 NOT NULL,
  host_ip       varchar(16) NOT NULL,
  file_name     varchar(512) NOT NULL,
  created       timestamp(6) NOT NULL,
  modified      timestamp(6) NOT NULL,
  write_success varchar(1) NOT NULL,
  read_success  varchar(1) NOT NULL,
  err_msg       text,
  PRIMARY KEY (scheduler_id,
  host_ip,
  file_name));
COMMENT ON TABLE deploy_node_history IS 'API 호스트 서버별 배포 정보';
COMMENT ON COLUMN deploy_node_history.scheduler_id IS '배포 스케줄러 고유번호';
COMMENT ON COLUMN deploy_node_history.host_ip IS 'IP';
COMMENT ON COLUMN deploy_node_history.file_name IS '파일명';
COMMENT ON COLUMN deploy_node_history.created IS '생성일';
COMMENT ON COLUMN deploy_node_history.modified IS '수정일';
COMMENT ON COLUMN deploy_node_history.write_success IS '파일 쓰기 완료 여부';
COMMENT ON COLUMN deploy_node_history.read_success IS '파일 읽기 완료 여부';
COMMENT ON COLUMN deploy_node_history.err_msg IS '에러가 난 구문';
CREATE TABLE aiml_subs (
  cate_id  int4 NOT NULL,
  find     varchar(50) NOT NULL,
  replace  varchar(100) NOT NULL,
  created  timestamp(6) NOT NULL,
  modified timestamp(6) NOT NULL,
  PRIMARY KEY (cate_id,
  find));
COMMENT ON TABLE aiml_subs IS '전처리 규칙';
COMMENT ON COLUMN aiml_subs.cate_id IS '전처리 카테고리 고유번호';
COMMENT ON COLUMN aiml_subs.find IS '찾을 문자열';
COMMENT ON COLUMN aiml_subs.replace IS '교체 문자열';
COMMENT ON COLUMN aiml_subs.created IS '생성일';
COMMENT ON COLUMN aiml_subs.modified IS '수정일';
CREATE TABLE aiml_link (
  id      int4 NOT NULL,
  cate_id int4 NOT NULL,
  main_id int4 NOT NULL,
  title   varchar(100) NOT NULL,
  comment varchar(255),
  url     varchar(255) NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE aiml_link IS '링크 정보';
COMMENT ON COLUMN aiml_link.id IS '고유번호';
COMMENT ON COLUMN aiml_link.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_link.main_id IS '대화 고유 번호';
COMMENT ON COLUMN aiml_link.title IS '링크 제목';
COMMENT ON COLUMN aiml_link.comment IS '링크 설명';
COMMENT ON COLUMN aiml_link.url IS '링크 URL';
CREATE TABLE aiml_main (
  id      int4 NOT NULL,
  cate_id int4 NOT NULL,
  input   varchar(255) NOT NULL,
  that_id int4 NOT NULL,
  reply   text NOT NULL,
  PRIMARY KEY (id,
  cate_id));
COMMENT ON TABLE aiml_main IS 'AIML대화';
COMMENT ON COLUMN aiml_main.id IS '고유 번호';
COMMENT ON COLUMN aiml_main.cate_id IS '대화 카테고리 고유번호';
COMMENT ON COLUMN aiml_main.input IS '질문';
COMMENT ON COLUMN aiml_main.that_id IS '이전 답변 번호';
COMMENT ON COLUMN aiml_main.reply IS '답변';
CREATE TABLE chat_log (
  id         int4 NOT NULL,
  cp_label   varchar(255) NOT NULL,
  user_id    varchar(50) NOT NULL,
  user_input varchar(255) NOT NULL,
  input      varchar(255) NOT NULL,
  reply      text,
  cate_name  varchar(128),
  created    timestamp(6) NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE chat_log IS '대화내역 로그';
COMMENT ON COLUMN chat_log.id IS '고유번호';
COMMENT ON COLUMN chat_log.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_log.user_id IS '아이디';
COMMENT ON COLUMN chat_log.user_input IS '사용자가 질문한 입력';
COMMENT ON COLUMN chat_log.input IS '질문';
COMMENT ON COLUMN chat_log.reply IS '답변';
COMMENT ON COLUMN chat_log.cate_name IS '대화 카테고리명';
COMMENT ON COLUMN chat_log.created IS '생성일';
CREATE TABLE deploy_scheduler (
  id          int4 NOT NULL,
  deploy_date timestamp(6) NOT NULL,
  cp_id       int4 NOT NULL,
  completed   varchar(1) NOT NULL,
  description varchar(255) NOT NULL,
  user_id     varchar(50) NOT NULL,
  sub_label   varchar(128) NOT NULL,
  gubun       varchar(100) NOT NULL,
  PRIMARY KEY (id));
COMMENT ON TABLE deploy_scheduler IS '파일 배포 스케줄러';
COMMENT ON COLUMN deploy_scheduler.id IS '고유번호';
COMMENT ON COLUMN deploy_scheduler.deploy_date IS '배포년월일시분초';
COMMENT ON COLUMN deploy_scheduler.cp_id IS '검색 서비스 고유 번호';
COMMENT ON COLUMN deploy_scheduler.completed IS '완료 여부(''Y'',''N'', "F")';
COMMENT ON COLUMN deploy_scheduler.description IS '설명';
COMMENT ON COLUMN deploy_scheduler.user_id IS '작업자아이디';
COMMENT ON COLUMN deploy_scheduler.sub_label IS '봇네임명';
COMMENT ON COLUMN deploy_scheduler.gubun IS '작업구분("배포","BOT변경")';
CREATE TABLE allow_ip (
  id       int4 NOT NULL,
  cp_id    int4 NOT NULL,
  host_ip  varchar(16) NOT NULL,
  enabled  char(1) DEFAULT 'Y'::bpchar NOT NULL,
  created  timestamp(6) NOT NULL,
  modified timestamp(6) NOT NULL,
  CONSTRAINT allow_ip_pkey
    PRIMARY KEY (id));
COMMENT ON TABLE allow_ip IS '검색 서비스 허용 정보';
COMMENT ON COLUMN allow_ip.id IS '고유번호';
COMMENT ON COLUMN allow_ip.cp_id IS 'cp id';
COMMENT ON COLUMN allow_ip.host_ip IS '접근 IP';
COMMENT ON COLUMN allow_ip.enabled IS '사용여부';
COMMENT ON COLUMN allow_ip.created IS '생성일';
COMMENT ON COLUMN allow_ip.modified IS '수정일';
CREATE TABLE bot_file (
  id          int4 NOT NULL,
  bot_id      int4 NOT NULL,
  file_name   varchar(128) NOT NULL UNIQUE,
  path        varchar(255) NOT NULL,
  last_loaded timestamp(6),
  file_type   varchar(4) NOT NULL,
  CONSTRAINT bot_file_pkey
    PRIMARY KEY (id));
COMMENT ON TABLE bot_file IS '봇 파일명';
COMMENT ON COLUMN bot_file.id IS '고유번호';
COMMENT ON COLUMN bot_file.bot_id IS '봇아이디고유번호';
COMMENT ON COLUMN bot_file.file_name IS 'bot-1.xml
bot-2.xml
substitutions-1.xml
substitutions-2.xml';
COMMENT ON COLUMN bot_file.path IS '파일 경로';
COMMENT ON COLUMN bot_file.last_loaded IS '최근 갱신일';
COMMENT ON COLUMN bot_file.file_type IS '파일 종류(SUBS, AIML, PROP,PRED)';
CREATE TABLE cp (
  id          int4 NOT NULL,
  label       varchar(255) NOT NULL UNIQUE,
  url         varchar(255),
  created     timestamp(6) NOT NULL,
  modified    timestamp(6) NOT NULL,
  token       varchar(32) NOT NULL,
  description varchar(255),
  enabled     char(1),
  CONSTRAINT cp_pkey
    PRIMARY KEY (id));
COMMENT ON TABLE cp IS '검색 서비스';
COMMENT ON COLUMN cp.id IS '검색 서비스 고유번호';
COMMENT ON COLUMN cp.label IS 'SampleBot';
COMMENT ON COLUMN cp.url IS '서비스 접근 URL';
COMMENT ON COLUMN cp.created IS '생성일';
COMMENT ON COLUMN cp.modified IS '수정일';
COMMENT ON COLUMN cp.token IS 'api 서비스 키';
COMMENT ON COLUMN cp.description IS '설명';
COMMENT ON COLUMN cp.enabled IS '사용여부';
CREATE TABLE cp_user (
  id          int4 NOT NULL,
  user_id     varchar(50) NOT NULL,
  name        varchar(128) NOT NULL,
  cell_phone  varchar(255),
  enabled     char(1) DEFAULT 'Y'::bpchar NOT NULL,
  created     timestamp(6) NOT NULL,
  modified    timestamp(6) NOT NULL,
  cp_id       int4 NOT NULL,
  description varchar(255),
  auth        varchar(3) NOT NULL,
  menu        varchar(4000),
  group_name  varchar(200),
  last_login  timestamp(6),
  CONSTRAINT cp_user_pkey
    PRIMARY KEY (id));
COMMENT ON TABLE cp_user IS 'CMS 사용자';
COMMENT ON COLUMN cp_user.id IS '고유번호';
COMMENT ON COLUMN cp_user.user_id IS '아이디';
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
CREATE TABLE aiml_predicate (
  user_id varchar(100) NOT NULL,
  bot_id  varchar(100) NOT NULL,
  name    varchar(128) NOT NULL,
  val     text NOT NULL,
  created timestamp(6) NOT NULL,
  CONSTRAINT predicate_pkey
    PRIMARY KEY (user_id,
  bot_id,
  name));
COMMENT ON TABLE aiml_predicate IS '최근 사용자 대화 내역';
COMMENT ON COLUMN aiml_predicate.user_id IS '사용자 아이디';
COMMENT ON COLUMN aiml_predicate.bot_id IS '봇아이디';
COMMENT ON COLUMN aiml_predicate.name IS '입력값';
COMMENT ON COLUMN aiml_predicate.val IS '답변';
COMMENT ON COLUMN aiml_predicate.created IS '생성일';
CREATE TABLE chat_log_process
(
  id integer NOT NULL, -- 고유 번호
  cp_label character varying(255) NOT NULL, -- 봇 아이디
  user_input character varying(255) NOT NULL, -- 처리한(할) 질문 내역
  type character varying(1) NOT NULL, -- 처리상태 ( S:신규 P:확인필요 E:처리완료 )
  created timestamp(6) without time zone NOT NULL DEFAULT now(), -- 최초 처리 시간
  CONSTRAINT chat_log_process_pkey PRIMARY KEY (id),
  CONSTRAINT chat_log_process_cp_label_user_input_key UNIQUE (cp_label, user_input)
);
COMMENT ON TABLE chat_log_process
  IS '고객 질문을 처리한 내역';
COMMENT ON COLUMN chat_log_process.id IS '고유 번호';
COMMENT ON COLUMN chat_log_process.cp_label IS '봇 아이디';
COMMENT ON COLUMN chat_log_process.user_input IS '처리한(할) 질문 내역';
COMMENT ON COLUMN chat_log_process.type IS '처리상태 ( S:신규 P:확인필요 E:처리완료 )';
COMMENT ON COLUMN chat_log_process.created IS '최초 처리 시간';
CREATE TABLE click_stat
(
  link_id integer NOT NULL, -- 사용자가 클릭한 링크의 아이디 값
  label character varying(255) NOT NULL,
  token character varying(32) NOT NULL, -- 연동에 필요한 토큰 값
  user_id character varying(128) NOT NULL, -- 사용자 구분값
  chat character varying(255) NOT NULL, -- 대화내역
  created timestamp(6) without time zone NOT NULL -- 생성일
);
COMMENT ON TABLE click_stat
  IS '링크 클릭 통계';
COMMENT ON COLUMN click_stat.link_id IS '사용자가 클릭한 링크의 아이디 값';
COMMENT ON COLUMN click_stat.token IS '연동에 필요한 토큰 값';
COMMENT ON COLUMN click_stat.user_id IS '사용자 구분값';
COMMENT ON COLUMN click_stat.chat IS '대화내역';
COMMENT ON COLUMN click_stat.created IS '생성일';

CREATE TABLE repository
(
  object_key character varying(100) NOT NULL, -- 오브젝트 키값
  key character varying(100) NOT NULL, -- 키값
  value text NOT NULL, -- 데이터 값
  created timestamp(6) without time zone NOT NULL DEFAULT now(), -- 생성일
  CONSTRAINT repository_pkey PRIMARY KEY (object_key, key)
);
COMMENT ON TABLE repository
  IS 'programd 기본 데이터 저장소';
COMMENT ON COLUMN repository.object_key IS '오브젝트 키값';
COMMENT ON COLUMN repository.key IS '키값';
COMMENT ON COLUMN repository.value IS '데이터 값';
COMMENT ON COLUMN repository.created IS '생성일';
