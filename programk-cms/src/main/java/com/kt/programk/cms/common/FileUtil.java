/*
 *  Copyright ⓒ 2016 kt corp. All rights reserved.
 *
 *  This is a proprietary software of kt corp, and you may not use this file except in
 *  compliance with license agreement with kt corp. Any redistribution or use of this
 *  software, with or without modification shall be strictly prohibited without prior written
 *  approval of kt corp, and the copyright notice above does not evidence any actual or
 *  intended publication of such software.
 */
package com.kt.programk.cms.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import au.com.bytecode.opencsv.CSVWriter;

import com.kt.programk.common.utils.ConfigProperties;

/**
 * 업로드 파일 유틸
 */
@Component("fileUtil")
public class FileUtil {

    /**
     * The constant LOG.
     */
    private static final Logger LOG = LoggerFactory.getLogger(FileUtil.class);

    /**
     * The Config.
     */
    @Autowired
    private ConfigProperties config;

    public List<Map<String, Object>> uploadFileInfo(HttpServletRequest request) throws IOException {
        MultipartHttpServletRequest multipartHttpServletRequest = (MultipartHttpServletRequest) request;
        Iterator<String> iterator = multipartHttpServletRequest.getFileNames();

        MultipartFile multipartFile = null;
        String originalFileName = null;
        String originalFileExtension = null;
        String storedFileName = null;

        List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
        Map<String, Object> listMap = null;

        File file = new File(config.getString("csv.programk.path"));
        if (!file.exists()) {
            file.mkdirs();
        }

        while (iterator.hasNext()) {
            multipartFile = multipartHttpServletRequest.getFile(iterator.next());
            listMap = new HashMap<String, Object>();

            if (!multipartFile.isEmpty()) {
                originalFileName = multipartFile.getOriginalFilename();
                originalFileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                storedFileName = getRandomString() + originalFileExtension;

                if (originalFileName.toLowerCase().endsWith(".csv")) {
                    file = new File(config.getString("csv.programk.path") + storedFileName);
                    multipartFile.transferTo(file);

                    listMap.put("status", "0");
                    listMap.put("filePath", config.getString("csv.programk.path") + storedFileName);
                    list.add(listMap);
                } else {
                    listMap.put("status", "2");
                }
            } else {
                listMap.put("status", "1");
            }
        }
        return list;
    }

    public void createErrorFile(String filePath, List<String[]> data) {
        int lastIndex = filePath.lastIndexOf("/");
        String filename = "error_" + filePath.substring(lastIndex + 1);
        String fullFilename = config.getString("csv.programk.path") + filename;

        try {
            FileOutputStream fileOutputStream = new FileOutputStream(fullFilename);
            CSVWriter cw = new CSVWriter(new OutputStreamWriter(fileOutputStream, "EUC-KR"), ',', '"');
            Iterator<String[]> it = data.iterator();

            try {
                while (it.hasNext()) {
                    String[] s = (String[]) it.next();
                    cw.writeNext(s);
                }
            } finally {
                cw.close();
                fileOutputStream.close();
            }
        } catch (IOException e) {
            LOG.error("파일 생성 실패", e);
        }
    }

    public void downloadFile(HttpServletRequest request, HttpServletResponse response, String filename) {

        File sample = new File(config.getString("csv.programk.path") + filename);

        response.setCharacterEncoding("euc-kr");
        response.setContentType("application/octet-stream charset=\"euc-kr\"");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + filename + "\"");

        FileInputStream fileInputStream = null;
        OutputStream responseOutputStream = null;
        try {
            fileInputStream = new FileInputStream(sample);
            responseOutputStream = response.getOutputStream();
            int bytes;
            while (true) {
            	bytes = fileInputStream.read();
            	if (bytes == -1){
            		break;
            	}else{
            		responseOutputStream.write(bytes);
            	}
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (fileInputStream != null) {
                    fileInputStream.close();
                }
                if (responseOutputStream != null) {
                    responseOutputStream.close();
                }
            } catch (IOException e) {
                LOG.error("파일 다운로드 실패", e);
            }
        }
    }

    public void removeFile(String filename) {
        String fullPath = config.getString("csv.programk.path") + filename;

        File file = new File(fullPath);
        if (file.exists()) {
            file.delete();
        }
    }

    public static String getRandomString() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}

