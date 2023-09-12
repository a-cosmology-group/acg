// 2023-04-20: declare variables with let and const instead of var
// Louis Marmet's JavaScript Cosmology Calculator
//  by Louis Marmet 2021-07-05


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//                          cosmology model                          *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function SSTz_cosmology(z) {
  let dA = Math.log(1 + z);               // angular distance [Hubble]
  let dL = Math.sqrt(1 + z) * dA;         // luminosity distance [Hubble]
  let V = 4 * Math.PI/3 * dA * dA * dA;   // volume within redshift z [Hubble^3]
  return [dA, dL, V];
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//   generate HTML output with results, units and raw observations   *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function display_SSTz(Hz, z) {
  const lyrpc = 3.26156   // coefficent for converting parsec to light-year

  let [dA, dL, V] = SSTz_cosmology(z);
  let dA_Gpc = (1/Hz) * dA;
  let dA_Glyr = lyrpc * dA_Gpc;
  let dA_kpc_arcsec = scale * dA_Gpc;
  let dL_Gpc = (1/Hz) * dL;
  let dL_Glyr = lyrpc * dL_Gpc;
  let mu = 5*Math.log(dL_Gpc * 1E8)/Math.log(10);     // distance modulus
// apparent distance modulus for supernovae
  let muSN = mu + 2.5*Math.log(1 + z)/Math.log(10);   // number of photon is conserved in the stretched light-curve
  let text =
    'For <b>H<sub>z</sub></b> = ' + format_prefix(Hz, 0, 1) + '/Gpc [or ' + format_prefix(c * Hz, 1, 1) + 'm/s/Mpc]:<br>';
//
  text += '<ul><li>The "Big Bang" hypothesis has no meaning.</li>';
  text += '<li>The concept of "age of the universe" has no meaning.</li>';
  text += '<li>The Hubble redshift <b>H<sub>z</sub></b> was ' + format_prefix(Hz, 0, 1) + '/Gpc.</li>';
  text += '<li>The light travel time was ' + format_prefix(dA_Glyr, 3, 1) + 'yr.</li>';
  text +=
    '<li>The radial distance&nbsp; r<sub>&nbsp;</sub>= ' + format_prefix(dA_Gpc, 3, 1) + 'pc or ' +
    format_prefix(dA_Glyr, 3, 1) + 'ly.<br>';
  text +=
    '<li>The volume within redshift <b>z</b> is ' + format_prefix((1/Hz) * (1/Hz) * (1/Hz) * V, 3, 3) + 'pc<sup>3</sup>.</li>';
  text +=
    '<li>The angular distance&nbsp; d<sub>A</sub> = ' + format_prefix(dA_Gpc, 3, 1) +
    'pc or ' + format_prefix(dA_Glyr, 3, 1) + 'ly;&nbsp; scale = ' + format_prefix(dA_kpc_arcsec/1000, 2, 1) + "pc/''.</li>";
  text += '<li>The luminosity distance&nbsp; d<sub>L</sub> = ' + format_prefix(dL_Gpc/1000, 4, 1) + 'pc or ' +
    format_prefix(dL_Glyr/1000, 4, 1) + 'ly;&nbsp; &mu; = ' + format_prefix(mu, 0, 1) + ' mag.</li>';
  text += '<li>The concept of&nbsp; "deceleration parameter"<sub>&nbsp;</sub> has no meaning.</li></ul>';
//
  text += '<hr size="1">';
  text += '<center><u>Reported in the SSTz framework</u></center><br>';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  text += '<center>Standard galaxy:</center>';
  text += '<ul><li>Absolute magnitude M = <b>m</b> - &mu; = <b>m</b> - ' + format_prefix(mu, 0, 1) + ' mag.</li>';
  text += '<li>Apparent size ' + format_prefix(dA_kpc_arcsec/1000, 2, 1) + "pc/''.</li>";
  text += '&nbsp; </li>';
  text +=
    '<li>Angular distance&nbsp; d<sub>A</sub> = ' + format_prefix(dA_Gpc, 3, 1) + 'pc or ' +
    format_prefix(dA_Glyr, 3, 1) + 'ly;&nbsp; scale = ' + format_prefix(dA_kpc_arcsec/1000, 2, 1) + "pc/''.<br>";
  text += '&nbsp; </li>';
  text +=
    '<li>Luminosity distance&nbsp; d<sub>L</sub> = ' + format_prefix(dL_Gpc, 3, 1) +
    'pc or ' + format_prefix(dL_Glyr, 3, 1) + 'ly.<br>';
  text += '<li>Tolman signal&nbsp; <b>&lt;SB&gt;</b> &propto; 2.5 log (1 + <b>z</b>)<sup><b>τ</b></sup> mag:<br>';
  text +=
    '<b>τ</b> &equiv; 2log<big>(</big>d<sub>L</sub>/d<sub>A</sub><big>)</big>/log(1 + <b>z</b>)' +
    ' = 1, i.e. no expansion.</li></ul>';
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  text += '<center>Standard Type Ia supernova:</center>';
  text += '<ul><li>Apparent dilation of light curve by a factor (1 + <b>z</b>) = ' + format_prefix(1 + z, 0, 1) + '.</li>';
  text +=
    '<li>Apparent luminosity distance&nbsp; <u>d</u><sub>L</sub> = ' + format_prefix(dL_Gpc * Math.sqrt(1 + z), 3, 1) +
    'pc or ' + format_prefix(dL_Glyr * Math.sqrt(1 + z), 3, 1) + 'ly.</li>';
  text += '<li>Apparent distance modulus&nbsp; <u>&mu;</u> = ' + format_prefix(muSN, 0, 1) + ' mag.</li>';
  text += '<li>Apparent absolute magnitude <u>M</u> = <b>m</b> - <u>&mu;</u> = <b>m</b> - ' + format_prefix(muSN, 0, 1) + ' mag.</li>';
  text += '<li>Width&nbsp; <b>w</b> = ' + format_prefix(1 + z, 0, 1) + ', stretch parameter&nbsp; s = 1.</li></ul>'
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  text += '<center>Blackbody surface at T = 6000 K';
  if (z >= 13.27) {    // Use spectroscopically confirmed redshift of the most distant galaxy
    text += ' at <b>z</b> = 13.27';
    z = 13.27;
  }
  text += ':</center>';
  text +=
    '<ul><li><a href="https://en.wikipedia.org/wiki/Wien%27s_displacement_law" ' +
    'target="_blank">Effective Wien temperature</a> from peak radiance&nbsp; <b>T<sub>w</sub></b> = ' +
    format_prefix(6000/(1 + z), 0, 1) + ' K.</li>';
  text +=
    '<li>Spectral radiance&nbsp; B<sub>ν</sub>(ν, T<sub>w</sub>, z) = ' + format_prefix((1 + z) ** 3, 0, 1) + 
    ' <big>(</big>2hν<sup>3</sup><big>/</big>c<sup>2</sup><big>)</big>' +
    '<big>[</big>e<sup>hν/(kT<sub>w</sub>)</sup> - 1<big>]</big><sup>-1</sup>.</li></ul>';

  return text;
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//                     read all input parameters                     *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function read_SSTz_inputs() {
  let Hz = parseFloat(document.getElementById('hz-SSTz').value);  // Hubble constant [/Gpc]
  let z = parseFloat(document.getElementById('redshift').value);  // redshift of the object
  if (!(z >= 0)) z = 0
  return [Hz, z];
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//                            update SSTz                            *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function doSSTz() {
  let [Hz, z] = read_SSTz_inputs();
  document.getElementById('results-SSTz').innerHTML = display_SSTz(Hz, z);
  return;
}
