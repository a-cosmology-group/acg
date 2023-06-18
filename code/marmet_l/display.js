// 2023-04-20: declare variables with let and const instead of var
// Function definitions for display format
// Louis Marmet, 2021-07-05

const c = 299.792458;     // velocity of light in Mm/sec
const scale = 4.8481368;  // convert dA Gpc to size in kpc/arcsec


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//                         call both models                          *
function doRedshift()  {
  doLCDM();
  doSSTz();
  return;
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//       find H0 to match radial distances from SSTz and ΛCDM        *
function find_LCDM_h0() {
  let dA_temp, dAGO_Gpc_temp;

  let [Hz, z_S] = read_SSTz_inputs();                     // inputs for SSTz
  let [D_S, , ] = SSTz_cosmology(z_S);
  let D_Gpc = (1/Hz)*D_S;                                 // SSTz's D_Gpc
  let [H0, WM, WL, GSE, , z] = read_LCDM_inputs();        // inputs for ΛCDM
  let H0_low = 50;
  let H0_high = 100;
  let [, , , , , dA_high, , ] = LCDM_cosmology(H0_high, WM, WL, z);   // reading dA into dA_high
  H0 = (H0_low + H0_high)/2;                  // divide-and-conquer
  let dAGO_Gpc_high = (c/H0_high)*dA_high / (1 + z) ** GSE;           // ΛCDM's dAGO_Gpc
  while (H0_high - H0_low > 0.05) {
    [, , , , , dA_temp, , ] = LCDM_cosmology(H0, WM, WL, z);
    dAGO_Gpc_temp = (c/H0)*dA_temp / (1 + z) ** GSE;                  // ΛCDM's dAGO_Gpc
    if ( (D_Gpc < dAGO_Gpc_temp) == (D_Gpc < dAGO_Gpc_high) ) {
      H0_high = H0;                           // target is below H0
      dAGO_Gpc_high = dAGO_Gpc_temp;
    } else {
      H0_low = H0;                            // target is above H0
    }
    H0 = (H0_low + H0_high)/2;                // divide-and-conquer
  }
  document.getElementById('h0-LCDM').value = format_prefix(H0, 0, 1);
  doLCDM();

  return;
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  format x, units [prfix(n3)**p], and return a string with prefix  *
function format_prefix(x, n3, p)  {
  const prfix = " kMGT";    // prefix
  let space = '';           // no end space if no prefix
  if (n3 > 0) space = ' ';  // there is a prefix
  let m = 0;                // at least m digits after the decimal point
  let absx = Math.abs(x);
  switch(p) {
    case 1:       // linear units
      while (absx < 1 && n3 > 0)  { absx *= 1000; n3 -= 1; }
      break;
    case 3:       // cubic units
      while (absx < 0.001 && n3 > 0)  { absx *= 1e9;  n3 -= 1; }
      break;
    default:      // don't do anything
      ;
    }
  while (absx < 100 && m < 3)  { absx *= 10; m += 1; }  // keep 3 digits
  let strx = "" + Math.round(absx);                     // create string
  while (m > strx.length-1)                             // add leading zeros
    strx = "0" + strx;
  if (m > 0) {                                          // add decimal point
    strx = strx.substring(0, strx.length-m)+ "." + strx.substring(strx.length-m, strx.length);
  }
  if (x < 0)  strx = "-" + strx;                        // add negative sign
  strx += space;                                        // add space==' ' when there is a prefix
  if (n3 != 0)  strx += prfix.substring(n3, n3+1);      // add prefix

  return strx;
}


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//                         reset parameters                          *
function reset_parameters() {
  document.getElementById("hz-SSTz").value = "0.247";   // Hubble constant [/Gpc]
  document.getElementById('h0-LCDM').value = "69.6";    // Hubble constant [km/s/Mpc]
  document.getElementById('wm-LCDM').value = "0.286";   // Omega(matter)
  document.getElementById('wl-LCDM').value = "0.714";   // Omega(lambda)
  document.getElementById('gse-LCDM').value = "-0.89";  // galactic size evolution
  document.getElementById('gle-LCDM').value = "1.08";   // galactic luminosity evolution
  doSSTz();
  doLCDM();
  return;
}