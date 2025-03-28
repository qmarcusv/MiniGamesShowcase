import des from "../../assets/temp/game2.png"; // use actual extension if it's .png, .webp, etc.
import Navigator from "../../shared/navigator/navigator.component";

export default function Description2() {
  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Trò chơi 2: Câu hỏi</h1>

      <img src={des} alt="Map Match preview" className="rounded-xl w-full max-w-2xl mx-auto mb-6 shadow-lg" />

      <p className="text-lg text-gray-200 mb-4">Làm cái timer to, cháu cũng chưa biết thêm mấy năng lực ví dụ như loại bỏ 1 nửa các phương án sai</p>

      <Navigator previewLink="../game1" nextLink="../game3" />
    </div>
  );
}
