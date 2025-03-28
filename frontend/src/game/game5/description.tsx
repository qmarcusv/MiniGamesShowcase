import des from "../../assets/temp/game5.png"; // use actual extension if it's .png, .webp, etc.
import Navigator from "../../shared/navigator/navigator.component";

export default function Description5() {
  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Trò chơi 5: Tài liệu bay</h1>

      <img src={des} alt="Map Match preview" className="rounded-xl w-full max-w-2xl mx-auto mb-6 shadow-lg" />

      <p className="text-lg text-gray-200 mb-4">
        cho người chơi chọn 1 dạng câu hỏi: chọn theo tác giả, chọn theo thời gian, chọn theo loại hình,... trong kho của mình sẽ có 1 số câu hỏi liên
        quan ví dụ như tác giả sở giáo dục vn, tg bộ lưu trữ quốc gia, những cái đó sẽ hiện ra rồi người chơi chọn những tài liệu đang di chuyển với
        chủ đề đúng theo câu hỏi
      </p>

      <Navigator previewLink="../game4" nextLink="../game6" />
    </div>
  );
}
