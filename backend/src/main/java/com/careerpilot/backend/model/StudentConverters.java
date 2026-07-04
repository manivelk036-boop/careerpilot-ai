package com.careerpilot.backend.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StudentConverters {

    private static final ObjectMapper mapper = new ObjectMapper();

    @Converter
    public static class StringListConverter implements AttributeConverter<List<String>, String> {
        @Override
        public String convertToDatabaseColumn(List<String> attribute) {
            try {
                return mapper.writeValueAsString(attribute == null ? new ArrayList<>() : attribute);
            } catch (Exception e) {
                return "[]";
            }
        }

        @Override
        public List<String> convertToEntityAttribute(String dbData) {
            try {
                if (dbData == null || dbData.isEmpty()) return new ArrayList<>();
                return mapper.readValue(dbData, new TypeReference<List<String>>() {});
            } catch (Exception e) {
                return new ArrayList<>();
            }
        }
    }

    @Converter
    public static class BooleanListConverter implements AttributeConverter<List<Boolean>, String> {
        @Override
        public String convertToDatabaseColumn(List<Boolean> attribute) {
            try {
                return mapper.writeValueAsString(attribute == null ? new ArrayList<>() : attribute);
            } catch (Exception e) {
                return "[]";
            }
        }

        @Override
        public List<Boolean> convertToEntityAttribute(String dbData) {
            try {
                if (dbData == null || dbData.isEmpty()) return new ArrayList<>();
                return mapper.readValue(dbData, new TypeReference<List<Boolean>>() {});
            } catch (Exception e) {
                return new ArrayList<>();
            }
        }
    }

    @Converter
    public static class MapStringIntegerConverter implements AttributeConverter<Map<String, Integer>, String> {
        @Override
        public String convertToDatabaseColumn(Map<String, Integer> attribute) {
            try {
                return mapper.writeValueAsString(attribute == null ? new HashMap<>() : attribute);
            } catch (Exception e) {
                return "{}";
            }
        }

        @Override
        public Map<String, Integer> convertToEntityAttribute(String dbData) {
            try {
                if (dbData == null || dbData.isEmpty()) return new HashMap<>();
                return mapper.readValue(dbData, new TypeReference<Map<String, Integer>>() {});
            } catch (Exception e) {
                return new HashMap<>();
            }
        }
    }

    @Converter
    public static class MapStringObjectConverter implements AttributeConverter<Map<String, Object>, String> {
        @Override
        public String convertToDatabaseColumn(Map<String, Object> attribute) {
            try {
                return mapper.writeValueAsString(attribute == null ? new HashMap<>() : attribute);
            } catch (Exception e) {
                return "{}";
            }
        }

        @Override
        public Map<String, Object> convertToEntityAttribute(String dbData) {
            try {
                if (dbData == null || dbData.isEmpty()) return new HashMap<>();
                return mapper.readValue(dbData, new TypeReference<Map<String, Object>>() {});
            } catch (Exception e) {
                return new HashMap<>();
            }
        }
    }

    @Converter
    public static class ListMapConverter implements AttributeConverter<List<Map<String, Object>>, String> {
        @Override
        public String convertToDatabaseColumn(List<Map<String, Object>> attribute) {
            try {
                return mapper.writeValueAsString(attribute == null ? new ArrayList<>() : attribute);
            } catch (Exception e) {
                return "[]";
            }
        }

        @Override
        public List<Map<String, Object>> convertToEntityAttribute(String dbData) {
            try {
                if (dbData == null || dbData.isEmpty()) return new ArrayList<>();
                return mapper.readValue(dbData, new TypeReference<List<Map<String, Object>>>() {});
            } catch (Exception e) {
                return new ArrayList<>();
            }
        }
    }
}
