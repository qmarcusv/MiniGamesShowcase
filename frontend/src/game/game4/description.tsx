import Navigator from "../../shared/navigator/navigator.component";

export default function Description3() {
  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Trò chơi 4: So sánh quá khứ và hiện tại</h1>

      <p className="text-lg text-gray-200 mb-4">
        Cháu chưa có nghĩ ra display như nào nhưng đại khái trò này sẽ có các ảnh về các địa điểm ví dụ như nhà thờ đức bà hay map của 1 khu vực nào
        đó trước đây và bây giờ, xong người chơi sẽ phải so sánh và chọn ra các điểm khác biệt (input các điểm là mình đặt trước) rồi các kiểu các
        kiểu nữa
      </p>

      <Navigator previewLink="../game3" nextLink="../game5" />
    </div>
  );
}
