import des from "../../assets/temp/game1.png"; // use actual extension if it's .png, .webp, etc.
import Navigator from "../../shared/navigator/navigator.component";

export default function Description1() {
  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Trò chơi 1: Tìm địa điểm</h1>

      <img src={des} alt="Map Match preview" className="rounded-xl w-full max-w-2xl mx-auto mb-6 shadow-lg" />

      <p className="text-lg text-gray-200 mb-4">khó nhất là phần cho các điểm nó di chuyển swap cho nhau smooth</p>

      <Navigator previewLink="" nextLink="../game2" />
    </div>
  );
}
