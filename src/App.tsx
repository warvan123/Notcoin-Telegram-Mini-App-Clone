{clicks.map(click => (
  <div
    key={click.id}
    className="floating-num"
    style={{ 
      left: click.x, 
      top: click.y,
      position: 'absolute' // ئەڤە دێ هێلیت د جهێ خۆ دا بمینیت
    }}
    onAnimationEnd={() => removeClick(click.id)}
  >
    +{isBoost ? 5 : 1}
  </div>
))}
