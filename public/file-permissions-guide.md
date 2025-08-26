# دليل صلاحيات الملفات الآمنة
# Secure File Permissions Guide

## صلاحيات المجلدات (Directory Permissions)
```bash
# تطبيق صلاحيات المجلدات الآمنة - 755
find /path/to/website -type d -exec chmod 755 {} \;
```

## صلاحيات الملفات العامة (General File Permissions)
```bash
# تطبيق صلاحيات الملفات العامة - 644
find /path/to/website -type f -exec chmod 644 {} \;
```

## صلاحيات الملفات الحساسة (Sensitive Files)
```bash
# ملفات البيئة والأسرار - 600
chmod 600 .env .env.* secrets.json keys.json config.php database.php

# ملفات النسخ الاحتياطية
chmod 600 *.bak *.backup *.sql

# ملفات السجلات
chmod 600 *.log
```

## ملكية الملفات (File Ownership)
```bash
# تغيير المالك إلى مستخدم الويب (مثال: www-data)
chown -R www-data:www-data /path/to/website

# منع الكتابة العامة
find /path/to/website -type f -perm -o+w -exec chmod o-w {} \;
find /path/to/website -type d -perm -o+w -exec chmod o-w {} \;
```

## فحص الصلاحيات
```bash
# فحص الملفات ذات الصلاحيات الخطيرة
find /path/to/website -type f -perm -o+w -ls
find /path/to/website -type f -perm 777 -ls

# فحص ملفات البيئة
ls -la .env* *.conf *.ini
```

## تشفير النسخ الاحتياطية (Backup Encryption)
```bash
# تشفير النسخ الاحتياطية بـ AES-256
openssl enc -aes-256-cbc -in backup.sql -out backup.sql.enc -k "strong_password"

# فك تشفير النسخ الاحتياطية
openssl enc -aes-256-cbc -d -in backup.sql.enc -out backup.sql -k "strong_password"
```

## معايير الأمان المطبقة
✅ المجلدات: 755 (القراءة والتنفيذ للجميع، الكتابة للمالك فقط)
✅ الملفات العامة: 644 (القراءة للجميع، الكتابة للمالك فقط)
✅ الملفات الحساسة: 600 (القراءة والكتابة للمالك فقط)
✅ منع الكتابة العامة (no world-writable)
✅ المالك هو مستخدم الويب وليس root