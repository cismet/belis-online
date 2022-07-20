export class DivLayer_ extends GridLayer {
  createLeafletElement(props) {
    return L.DivLayer();
  }
  componentDidMount() {
    super.componentDidMount();
    this.setFilter();
  }
  updateLeafletElement(fromProps, toProps) {
    super.updateLeafletElement(fromProps, toProps);
    this.setFilter();
  }
}

const DivLayer = DivLayer_;

export default DivLayer;
