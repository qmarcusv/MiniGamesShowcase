import des from "../../assets/temp/game3.png"; // use actual extension if it's .png, .webp, etc.
import Navigator from "../../shared/navigator/navigator.component";

export default function Description1() {
  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Trò chơi 3: Khám phá bí ẩn</h1>

      <img src={des} alt="Map Match preview" className="rounded-xl w-full max-w-2xl mx-auto mb-6 shadow-lg" />

      <p className="text-lg text-gray-200 mb-4">
        Cho người chơi làm 1 cái gì đó, xong cái tờ giấy vo vụn sẽ từ từ được mở ra và cuối cùng là mở khóa phần thưởng
      </p>

      <Navigator previewLink="../game2" nextLink="../game4" />
    </div>
  );
}
