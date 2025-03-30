export interface WordEntry {
	word: string; // uppercase, no spaces, no accents
	hint: string;
}

export const game3Words: WordEntry[] = [
	{ word: "VIETNAM", hint: "Tên quốc gia" },
	{ word: "SAIGON", hint: "Tên cũ của TP.HCM" },
	{ word: "DANANG", hint: "Thành phố miền Trung" },
	{ word: "HOIAN", hint: "Phố cổ nổi tiếng" },
	{ word: "HUE", hint: "Kinh đô thời Nguyễn" },
	{ word: "PHUQUOC", hint: "Đảo du lịch lớn ở phía Nam" },
	{ word: "HANOI", hint: "Thủ đô nước Việt Nam" },
	{ word: "CUCHI", hint: "Địa đạo nổi tiếng thời chiến" },
	{ word: "NHATRANG", hint: "Thành phố biển xinh đẹp" },
];
