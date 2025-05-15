import os
import datetime
import logging

LOGDIR = "logs"

class LogManager:
    def __init__(self):
        # 현재 날짜와 시간으로 로그 파일 설정
        current_time = datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        if not os.path.exists(LOGDIR):
            os.makedirs(LOGDIR)
        log_file = os.path.join(LOGDIR, f"log_{current_time}.log")
        
        # 로거 설정
        self.logger = logging.getLogger("LogManager")
        self.logger.setLevel(logging.DEBUG)
        
        # 파일 핸들러 추가
        file_handler = logging.FileHandler(log_file, encoding="utf-8")
        file_handler.setLevel(logging.DEBUG)
        
        # 콘솔 핸들러 추가
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # 포맷 지정
        formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        # 핸들러를 로거에 추가
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)

        self.log_info("LogManager가 초기화 되었습니다..")
        self.log_info(f"Time: {current_time}")
        self.log_info("="*50 + "\n")

    def log_info(self, message):
        """Log an info message."""
        self.logger.info(f"{message}")

    def log_warning(self, message):
        """Log a warning message."""
        self.logger.warning(f"{message}")

    def log_error(self, message):
        """Log an error message."""
        self.logger.error(f"{message}")

    def log_critical(self, message):
        """Log a critical message."""
        self.logger.critical(f"{message}")