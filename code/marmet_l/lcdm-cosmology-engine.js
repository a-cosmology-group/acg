// 2023-04-24: added a computation of the Hubble parameter at redshift z
// 2023-04-20: declare variables with let and const instead of var
// 2021-09-29: corrected conversion error affecting only VCM_Gpc3
// 2021-07-05: Cosmology variables moved local, adapted to new code. Louis Marmet
//  Copyright Louis Marmet, all rights reserved.
// 2020-06-16: Copied with permission of Ned Wright.
// Ned Wright's Javascript Cosmology Calculator
//  by Ned Wright 25 Jul 1999
//  Copyright Edward L. Wright, all rights reserved.


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//                          cosmology model                          *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function LCDM_cosmology(H0, WM, WL, z) {
  const n = 1000;               // number of points in integrals
  const h = H0/100;             // H0/100
  const az = 1.0/(1+1.0*z);     // 1/(1+z(object))
  const WR = 4.165E-5/(h*h);    // Omega(radiation), includes 3 massless neutrino species, T0 = 2.72528
  const WK = 1 - WM - WR - WL;  // Omega curvaturve = 1 - Omega(total)

  let a;          // 1/(1+z), the scale factor of the Universe
  let adot;
  let ratio;
  let y;

  let zage = 0;   // age of Universe at redshift z in units of 1/H0
  for (let i = 0; i != n; i++) {
    a = az * (i + 0.5)/n;
    adot = Math.sqrt(WK + WM/a + WR/(a*a) + WL*a*a);
    zage += 1/adot;
  }
  zage = az * zage/n;
// Hubble parameter H(z); added 2023-04-24, Louis Marmet
  let Hz = H0 * Math.sqrt(WM * (1+z)**3 + WK * (1+z)**2 + WL);
// correction for annihilations of particles not present now like e+/e-
// added 13-Aug-03 based on T_vs_t.f
  let lpz = Math.log(1 + 1.0*z)/Math.log(10.0);
  let dzage = 0;
  if (lpz >  7.500) dzage = 0.002 * (lpz - 7.500);
  if (lpz >  8.000) dzage = 0.014 * (lpz - 8.000) +0.001;
  if (lpz >  8.500) dzage = 0.040 * (lpz - 8.500) +0.008;
  if (lpz >  9.000) dzage = 0.020 * (lpz - 9.000) +0.028;
  if (lpz >  9.500) dzage = 0.019 * (lpz - 9.500) +0.039;
  if (lpz > 10.000) dzage = 0.048;
  if (lpz > 10.775) dzage = 0.035 * (lpz -10.775) +0.048;
  if (lpz > 11.851) dzage = 0.069 * (lpz -11.851) +0.086;
  if (lpz > 12.258) dzage = 0.461 * (lpz -12.258) +0.114;
  if (lpz > 12.382) dzage = 0.024 * (lpz -12.382) +0.171;
  if (lpz > 13.055) dzage = 0.013 * (lpz -13.055) +0.188;
  if (lpz > 14.081) dzage = 0.013 * (lpz -14.081) +0.201;
  if (lpz > 15.107) dzage = 0.214;
  zage *= Math.pow(10.0, dzage);

  let DTT = 0.0;    // time from z to now in units of 1/H0; light travel time
  let dC = 0.0;     // comoving radial distance in units of c/H0
// do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (i = 0; i != n; i++) {
    a = az + (1 - az) * (i + 0.5)/n;
    adot = Math.sqrt(WK + WM/a + WR/(a*a) + WL*a*a);
    DTT += 1/adot;
    dC += 1/(a * adot);
  }
  DTT *= (1 - az)/n;
  dC *= (1 - az)/n;

  const x = Math.sqrt(Math.abs(WK)) * dC;
// tangential comoving distance
  if (x > 0.1) {
    ratio =  (WK > 0) ? 0.5*(Math.exp(x)-Math.exp(-x))/x : Math.sin(x)/x;
  } else {
    y = x * x;
    if (WK < 0) y = -y;  // fixed 13-Aug-2003 to correct sign error in expansion
    ratio = 1 + y/6 + y*y/120;
  }
  let dM = ratio * dC;    // tangential comoving distance

  let age = zage + DTT;   // total age: age at redshift z + light travel time; age of Universe in units of 1/H0
  let dA = az * dM;       // angular size distance
  let dL = dA/(az*az);    // Tolman test for expansion; luminosity distance

// comoving volume computation
  if (x > 0.1) {
    ratio = (WK > 0) ? (0.125*(Math.exp(2*x)-Math.exp(-2*x))-x/2)/(x*x*x/3) :
                       (x/2 - Math.sin(2*x)/4)/(x*x*x/3);
  } else {
    y = x * x;
    if (WK < 0) y = -y;  // fixed 13-Aug-03 to correct sign error in expansion
    ratio = 1 + y/5 + (2/105)*y*y;
  }
  let VCM = 4 * Math.PI * ratio * dC * dC * dC/3;     // comoving volume

  return [zage, Hz, DTT, dC, age, dA, dL, VCM];
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//   generate HTML output with results, units and raw observations   *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function display_LCDM(H0, WM, WL, GSE, GLE, z) {
  const TyrH0 = 977.812;    // coefficent for converting 1/H0 into Gyr

  let [zage, Hz, DTT, dC, age, dA, dL, VCM] = LCDM_cosmology(H0, WM, WL, z);
  let age_Gyr = (TyrH0/H0) * age;             // value of age in Gyr
  let zage_Gyr = (TyrH0/H0) * zage;           // value of zage in Gyr
  let DTT_Gyr = (TyrH0/H0) * DTT;             // value of DTT in Gyr
  let dC_Gpc = (c/H0) * dC;                   // dC in units of Giga-parsec
  let dC_Glyr = (TyrH0/H0) * dC;              // dC in units of Giga-light-year
  let VCM_Gpc3 = (c/H0)*(c/H0)*(c/H0) * VCM   // VCM in units of Giga-parsec-cubed
                                              // 2021-09-29 corrected conversion error affecting only VCM_Gpc3
  let dA_Gpc = (c/H0) * dA;                   // dA in units of Giga-parsec
  let dA_Glyr = (TyrH0/H0) * dA;              // dA in units of Giga-light-year
  let dA_kpc_arcsec = scale * dA_Gpc;         // size in kpc per arcsec
  let dL_Gpc = (c/H0)*dL;                     // dL in units of Giga-parsec
  let dL_Glyr = (TyrH0/H0)*dL;                // dL in units of Giga-light-year
  let Texample = 6000;
  if (z >= 13.27) Texample = 2976;            // Use spectroscopically confirmed redshift of the most distant galaxy

// LCDM Reported
  let dAO = dA / (1 + z) ** GSE;        // reported angular-size distance (before size evolution correction)
  let dLGO = dL / (1 + z) ** (GLE/2);   // reported luminosity distance (before luminosity evolution correction)
  let dLSNO = dC * (1 + z);             // Observed dL for supernovae;
  let dAO_Gpc = (c/H0) * dAO;           // dAO in units of Giga-parsec
  let dLSNO_Gpc = (c/H0) * dLSNO;
  let mu = 5*Math.log(dLSNO_Gpc * 1E8)/Math.log(10);    // distance modulus

  let text =
    'For <a href="http://www.astro.ucla.edu/~wright/glossary.html#H0" target="_blank">' +
    'H<sub>0</sub></a> = ' + format_prefix(H0, 1, 1) + 'm/s/Mpc, ' +
    '<a href="http://www.astro.ucla.edu/~wright/glossary.html#Omega" target="_blank">' +
    'Ω<sub>M</sub></a> = ' + format_prefix(WM, 0, 1) + ', ' +
    '<a href="http://www.astro.ucla.edu/~wright/glossary.html#CC" target="_blank">' +
    'Ω<sub>Λ</sub></a> = ' + format_prefix(WL, 0, 1) + ':<br>'
//
  text +=
    '<ul><li>It is now ' + format_prefix(age_Gyr, 3, 1) + 'yr since the Big Bang.</li>';
  text +=
    '<li>The age at redshift <b>z</b> was ' + format_prefix(zage_Gyr, 3, 1) + 'yr.</li>';
  text +=
    '<li>The Hubble parameter H(<b>z</b>)<sub>&nbsp;</sub>was ' + format_prefix(Hz, 0, 1) + ' km/s/Mpc.</li>';
  text +=
    '<li>The <a href="http://www.astro.ucla.edu/~wright/cosmo_02.htm#DT" target="_blank">' +
    'light travel time</a> was ' + format_prefix(DTT_Gyr, 3, 1) + 'yr.</li>';
  text +=
    '<li>The <a href="http://www.astro.ucla.edu/~wright/cosmo_02.htm#DH" target="_blank">' +
    'comoving radial distance</a>&nbsp; d<sub>C</sub> = ' + format_prefix(dC_Gpc, 3, 1) +
    'pc or ' + format_prefix(dC_Glyr, 3, 1) + 'ly.</li>';
  text +=
    '<li>The comoving volume within redshift <b>z</b> is ' + format_prefix(VCM_Gpc3, 3, 3) +
    'pc<sup>3</sup>.</li>';
  text +=
    '<li>The <a href="http://www.astro.ucla.edu/~wright/cosmo_02.htm#DA" target="_blank">' +
    'angular distance&nbsp; <i>d<sub>A</sub></i></a> = ' + format_prefix(dA_Gpc, 3, 1) +
    'pc or ' + format_prefix(dA_Glyr, 3, 1) + 'ly';
  text += ';&nbsp; scale = ' + format_prefix(dA_kpc_arcsec, 1, 1) + "pc/''.</li>";
  text +=
    '<li>The <a href="http://www.astro.ucla.edu/~wright/cosmo_02.htm#DL" target="_blank">' +
    'luminosity distance&nbsp; <i>d<sub>L</sub></i></a> = ' + format_prefix(dL_Gpc/1000, 4, 1) +
    'pc or ' + format_prefix(dL_Glyr/1000, 4, 1) + 'ly;&nbsp; <i>&mu;</i> = ' + format_prefix(mu, 0, 1) + ' mag.</li>';
  text +=
    '<li>The deceleration parameter&nbsp; q<sub>0</sub> = ' +
    format_prefix(WM/2 - WL, 0, 1) + '.</li></ul>';
//
  text += '<hr size="1">';
  text += '<center><u>Reported in the ΛCDM framework</u></center><br>';
//
  text += '<center>Standard galaxy:</center>';
  text +=
    '<ul><li>Absolute magnitude <i>M</i> = <b>m</b> - <i>&mu;</i> = <b>m</b> - <i>' + format_prefix(mu, 0, 1) + ' mag</i>.</li>';
  text += '<li>Apparent size <i>' + format_prefix(dA_kpc_arcsec/1000, 2, 1) + "pc/''</i>.</li>";
  text += '<li>Angular distance <i>without correction</i> for galactic size evolution:<br>';
    if (z < 7) {
      text += '&nbsp; &nbsp; <i><u>d</u><sub>A</sub> = ' + format_prefix(dAO_Gpc, 3, 1) + 'pc</i> or <i>' +
        format_prefix((TyrH0/H0) * dAO, 3, 1) + 'ly</i>;&nbsp; <i><u>scale</u></i> = <i>' + format_prefix(scale * dAO_Gpc, 1, 1) +
        "pc/''</i>,&nbsp; with n<sub>S</sub> = " + format_prefix(GSE, 0, 1) + '.</li>';
    } else {
      text += '&nbsp; &nbsp; Corrected <i><u>d</u><sub>A</sub></i> only available for z < 7.</li>';
    }
  text += '<li>Luminosity distance <i>without correction</i> for luminosity evolution:<br>';
    if (z < 1) {
      text += '&nbsp; &nbsp; <i><u>d</u><sub>L</sub></i> = <i>' + format_prefix((c/H0)*dLGO, 3, 1) + 'pc</i> or <i>' +
        format_prefix((TyrH0/H0)*dLGO, 3, 1) + 'ly</i>,&nbsp; with n<sub>L</sub> = ' + format_prefix(GLE, 0, 1) + '.</li>';
  } else {
      text += '&nbsp; &nbsp; Corrected <i><u>d</u><sub>L</sub></i> only available for z < 1.</li>';
  }
  text +=
    '<li>Tolman signal for <b>&lt;SB&gt;</b> &propto; 2.5 log ' +
    '(1 + <b>z</b>)<sup><b>τ</b></sup> mag:<br>' +
    '<b>τ</b> &equiv; 2log<big>(</big><i><u>d</u><sub>L</sub></i>/<i><u>d</u><sub>A</sub></i><big>)</big>/log(1 + <b>z</b>) = <i>' +
    format_prefix(2 * Math.log(dLGO/dAO)/Math.log(1 + z), 0, 1) + '</i> <i>without correction</i> for any evolution.</li></ul>';
//
  text += '<center>Standard Type Ia supernova:</center>';
  text +=
    '<ul><li>Time dilation of light curve (1 + <b>z</b>) = <i>' + format_prefix(1 + z, 0, 1) + '</i>.</li>';
  text +=
    '<li>Luminosity distance <i>d<sub>L</sub></i> = <i>' + format_prefix(dLSNO_Gpc, 3, 1) +
    'pc</i> or <i>' + format_prefix((TyrH0/H0) * dLSNO, 3, 1) + 'ly</i>.</li>';
  text +=
    '<li>Distance modulus&nbsp; <i>&mu;</i> = <i>' + format_prefix(mu, 0, 1) + ' mag</i>.</li>';
  text +=
    '<li>Absolute magnitude&nbsp; <i>M</i> = <b>m</b> - <i>&mu;</i> = <b>m</b> - <i>' + format_prefix(mu, 0, 1) + ' mag</i>.</li>';
  text +=
    '<li>Width&nbsp; <b>w</b> = ' + format_prefix(1 + z, 0, 1) + ', stretch parameter&nbsp; s = 1.</li></ul>';
//
  text += '<center>Blackbody surface at T = ' + Texample + ' K:</center>';
  text +=
    '<ul><li>Temperature of blackbody spectrum T<sub>z</sub> = <i>' +
    format_prefix(Texample/(1 + z), 0, 1) + ' K</i>.</li>';
  text +=
    '<li>Spectral radiance B<sub>&nu;</sub>(ν, T<sub>z</sub>) = ' +
    '<big>(</big>2hν<sup>3</sup><big>/</big>c<sup>2</sup><big>)</big>' +
    '<big>[</big>e<sup>hν/(kT<sub>z</sub>)</sup> - 1<big>]</big><sup>-1</sup>.</li></ul>';

  return text;
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//                     read all input parameters                     *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function read_LCDM_inputs() {
  let H0 = parseFloat(document.getElementById('h0-LCDM').value);      // Hubble constant
  let WM = parseFloat(document.getElementById('wm-LCDM').value);      // Omega(matter)
  let WL = parseFloat(document.getElementById('wl-LCDM').value);      // Omega(lambda)
  let GSE = parseFloat(document.getElementById('gse-LCDM').value);    // galactic size evolution
  let GLE = parseFloat(document.getElementById('gle-LCDM').value);    // galactic luminosity evolution
  let z = parseFloat(document.getElementById('redshift').value);      // redshift of the object
  if (document.getElementById('open-LCDM').checked) {
    WL = 0.0;
    document.getElementById('wl-LCDM').value = WL;
  }
  if (document.getElementById('flat-LCDM').checked) {
    WL = 1.0 - WM - 0.4165/(H0*H0);
    document.getElementById('wl-LCDM').value = Math.round(1000*WL)/1000;
  }
  if (document.getElementById('general-LCDM').checked) {
// nothing to do
  }
  if (!(z >= 0)) z = 0 
  return [H0, WM, WL, GSE, GLE, z];
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//                            update LCDM                            *
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function doLCDM() {
  let [H0, WM, WL, GSE, GLE, z] = read_LCDM_inputs();
  document.getElementById('results-LCDM').innerHTML = display_LCDM(H0, WM, WL, GSE, GLE, z);
  return;
}
