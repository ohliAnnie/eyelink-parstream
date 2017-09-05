-- Table: chat_time_stat

-- DROP TABLE chat_time_stat;

CREATE TABLE chat_time_stat
(
  cp_label character varying(255) NOT NULL, -- 봇아이디
  start_time character varying(14) NOT NULL, -- 시작시간
  end_time character varying(14) NOT NULL, -- 종료 시간
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
  OWNER TO programk;
GRANT ALL ON TABLE chat_time_stat TO programk_admin;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE chat_time_stat TO programk_dml;
GRANT SELECT ON TABLE chat_time_stat TO programk_select;
GRANT ALL ON TABLE chat_time_stat TO programk;
COMMENT ON TABLE chat_time_stat
  IS '시간대별 통계';
COMMENT ON COLUMN chat_time_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_time_stat.start_time IS '시작시간';
COMMENT ON COLUMN chat_time_stat.end_time IS '종료 시간';
COMMENT ON COLUMN chat_time_stat.search_count IS '검색건수';
COMMENT ON COLUMN chat_time_stat.response_count IS '응답건수';
COMMENT ON COLUMN chat_time_stat.success_percent IS '응답률';
COMMENT ON COLUMN chat_time_stat.user_count IS '유니크 사용자수';

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
  OWNER TO programk;
GRANT ALL ON TABLE chat_user_stat TO programk_admin;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE chat_user_stat TO programk_dml;
GRANT SELECT ON TABLE chat_user_stat TO programk_select;
GRANT ALL ON TABLE chat_user_stat TO programk;
COMMENT ON TABLE chat_user_stat
  IS '사용자별 통계 ';


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
  OWNER TO programk;
GRANT ALL ON TABLE chat_input_stat TO programk_admin;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE chat_input_stat TO programk_dml;
GRANT SELECT ON TABLE chat_input_stat TO programk_select;
GRANT ALL ON TABLE chat_input_stat TO programk;
COMMENT ON TABLE chat_input_stat
  IS '대화통계';


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
  OWNER TO programk;
GRANT ALL ON TABLE chat_category_stat TO programk_admin;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE chat_category_stat TO programk_dml;
GRANT SELECT ON TABLE chat_category_stat TO programk_select;
GRANT ALL ON TABLE chat_category_stat TO programk;
COMMENT ON TABLE chat_category_stat
  IS '카테고리 통계';

-- Table: chat_user_input_stat

-- DROP TABLE chat_user_input_stat;

CREATE TABLE chat_user_input_stat
(
  cp_label character varying(255) NOT NULL,
  user_input character varying(255) NOT NULL,
  start_time character varying(255) NOT NULL,
  end_time character varying(255) NOT NULL,
  total_cnt integer NOT NULL,
  CONSTRAINT chat_user_input_stat_pkey PRIMARY KEY (cp_label, user_input, start_time)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE chat_user_input_stat
  OWNER TO programk;
GRANT ALL ON TABLE chat_user_input_stat TO programk_admin;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE chat_user_input_stat TO programk_dml;
GRANT SELECT ON TABLE chat_user_input_stat TO programk_select;
GRANT ALL ON TABLE chat_user_input_stat TO programk;
COMMENT ON TABLE chat_user_input_stat
  IS '사용자 질문 통계';


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
  OWNER TO programk;
GRANT ALL ON TABLE chat_day_stat TO programk_admin;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE chat_day_stat TO programk_dml;
GRANT SELECT ON TABLE chat_day_stat TO programk_select;
GRANT ALL ON TABLE chat_day_stat TO programk;
COMMENT ON TABLE chat_day_stat
  IS '검색 일별 통계';
COMMENT ON COLUMN chat_day_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_day_stat.start_time IS '시작시간';
COMMENT ON COLUMN chat_day_stat.end_time IS '종료 시간';
COMMENT ON COLUMN chat_day_stat.search_count IS '검색건수';
COMMENT ON COLUMN chat_day_stat.response_count IS '응답건수';
COMMENT ON COLUMN chat_day_stat.success_percent IS '응답률';
COMMENT ON COLUMN chat_day_stat.user_count IS '유니크 사용자수';

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
  OWNER TO programk;
GRANT ALL ON TABLE chat_month_stat TO programk_admin;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE chat_month_stat TO programk_dml;
GRANT SELECT ON TABLE chat_month_stat TO programk_select;
GRANT ALL ON TABLE chat_month_stat TO programk;
COMMENT ON TABLE chat_month_stat
  IS '검색 월별 통계';
COMMENT ON COLUMN chat_month_stat.cp_label IS '봇아이디';
COMMENT ON COLUMN chat_month_stat.start_time IS '시작시간';
COMMENT ON COLUMN chat_month_stat.end_time IS '종료 시간';
COMMENT ON COLUMN chat_month_stat.search_count IS '검색건수';
COMMENT ON COLUMN chat_month_stat.response_count IS '응답건수';
COMMENT ON COLUMN chat_month_stat.success_percent IS '응답률';
COMMENT ON COLUMN chat_month_stat.user_count IS '유니크 사용자수';

