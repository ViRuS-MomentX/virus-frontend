import Year from './Year';

export default function Footer({ children }) {
  return (
    <footer className="ft">
      <div className="wrapper">
        <div className="ft-l">{children ?? <>страница Вируса, <Year /></>}</div>
        <div className="ft-r">сделано с next.js</div>
      </div>
    </footer>
  );
}
